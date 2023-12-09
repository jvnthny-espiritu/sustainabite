import React, { useState, useEffect, useRef } from 'react';
import { IonButtons, IonCol, IonContent, IonGrid, IonRow, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonPage, IonItem, IonInput, IonIcon, IonAvatar } from '@ionic/react';
import { formatDistanceToNow } from 'date-fns';
import { locationOutline, personOutline, createOutline, ellipsisVertical, logOutOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { OverlayEventDetail } from '@ionic/core/components';
import PostCard from '../components/ProfilePostCard';
import EditPostModal from '../components/EditPost';
import '../assets/css/profile.css';



interface PostData {
  id: string;
  userId: string;
  postedAt: string;
  title: string;
  description: string;
  selectedCategory: string;
  location: string;
  pickupTime: string;
  images: string[];
}

interface UserData {
  username: string;
  name: string;
}

function Profile() {
  const history = useHistory();
  const modal = useRef<HTMLIonModalElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = firebase.auth().currentUser;
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  
  const [user, setUser] = useState<firebase.User | null>(null);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const [posts, setPosts] = useState<{
    selectedCategory: string;
    title: string;
    description: string;
    location: string;
    images: never[]; id: string; postedAt: string; userId: string 
}[]>([]);
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});

  const [modalUsername, setModalUsername] = useState('');
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPassword, setModalPassword] = useState('');

  const [editPostId, setEditPostId] = useState<string | null>(null);

  const handleEditPostClick = (postId: string) => {
    setEditPostId(postId);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await firebase.firestore().collection('posts').doc(postId).delete();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openModal = () => {
    modal.current?.present();
    setModalUsername(username);
    setModalName(name);
    setModalEmail(email);
    setModalPassword('');
  };


  useEffect(() => {
    const fetchUserDataAndPosts = async () => {
      // ... (existing code)

      const userDoc = await firebase.firestore().collection('users').doc(user?.uid).get();
      const profilePhotoUrl = userDoc.data()?.profilePhotoUrl || null;

      setProfilePhotoUrl(profilePhotoUrl);
    };

    fetchUserDataAndPosts();
  }, [user]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserDataAndPosts = async () => {
      if (user) {
        try {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          const usernameFromFirestore = userDoc.data()?.username;
          const nameFromFirestore = userDoc.data()?.name;
  
          console.log('Username from Firestore:', usernameFromFirestore);
          console.log('Name from Firestore:', nameFromFirestore);
  
          setUsername(usernameFromFirestore || 'Unknown User');
          setName(nameFromFirestore || 'Unknown Name');
  
          const postsRef = firebase.firestore().collection('posts');
          const userPostsListener = postsRef
            .where('userId', '==', user.uid)
            .onSnapshot(async (snapshot) => {
              const userPostsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                userId: doc.data().userId,
                postedAt: doc.data().postedAt,
                title: doc.data().title,
                description: doc.data().description,
                selectedCategory: doc.data().selectedCategory,
                location: doc.data().location,
                pickupTime: doc.data().pickupTime,
                images: doc.data().images || [],
              }));
  
              const sortedUserPosts = userPostsData.sort(
                (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
              );
  
              setPosts(sortedUserPosts);
  
              const usersSnapshot = await firebase.firestore().collection('users').get();
              const usersData: { [key: string]: UserData } = {};
              usersSnapshot.docs.forEach((doc) => {
                usersData[doc.id] = doc.data() as UserData;
              });
  
              setUsers(usersData);
            });
  
          return () => {
            userPostsListener();
          };
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
  
    fetchUserDataAndPosts();
  }, [user]);

  const validateEmail = (email: string) => {
    return email.match(
      /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zAZ0-9-]{0,61}[a-zAZ0-9])?)*$/
    );
  };

  const validate = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;
    setIsValid(undefined);

    if (value === '') return;

    validateEmail(value) !== null ? setIsValid(true) : setIsValid(false);
  };

  const markTouched = () => {
    setIsTouched(true);
  };

  const handleUsernameChange = async (event: CustomEvent) => {
    const newUsername = event.detail.value || '';
    setUsername(newUsername);

    // Update username in Firestore
    if (user) {
      try {
        const userRef = firebase.firestore().collection('users').doc(user.uid);
        await userRef.update({
          username: newUsername,
        });

        // Successfully updated username
        console.log('Username updated successfully:', newUsername);
      } catch (error) {
        // Handle error while updating username
        console.error('Error updating username:', error);
      }
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      const selectedFile = files[0];

      setProfilePhoto(selectedFile);
    }
  };
  
  const uploadPhotoToFirestore = async (file: File) => {
    try {
      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child(`profile_photos/${user?.uid}`);
      await fileRef.put(file);
      const downloadUrl = await fileRef.getDownloadURL();
  
      await firebase.firestore().collection('users').doc(user?.uid).update({
        profilePhotoUrl: downloadUrl,
      });
    } catch (error) {
      console.error('Error uploading photo to Firestore:', error);
    }
  };
  
  const updateProfilePhoto = async () => {
    if (profilePhoto && user) {
      await uploadPhotoToFirestore(profilePhoto);
      // After updating the profile photo in Firestore, fetch the updated user data
      const updatedUserDoc = await firebase.firestore().collection('users').doc(user.uid).get();
      const updatedProfilePhotoUrl = updatedUserDoc.data()?.profilePhotoUrl;
      
      // Update the local state with the new profile photo URL
      setProfilePhoto(updatedProfilePhotoUrl);
  
      // You can optionally update other parts of your UI with the new photo
      // ...
    }
  };
  
  const handleNameChange = (event: CustomEvent) => {
    setName(event.detail.value || '');
  };

  const handleEmailChange = (event: CustomEvent) => {
    setEmail(event.detail.value || '');
  };

  const handlePasswordChange = (event: CustomEvent) => {
    setPassword(event.detail.value || '');
  };

  
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      console.log('naka log out ka na gago');
      // Redirect to the start page after successful logout
      history.push('/start'); // Update '/start' with the actual path of your start page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCreatePostClick = () => {
    history.push('/Post');
  };


  const [message, setMessage] = useState('This modal example uses triggers to automatically open a modal when the button is clicked.');

  function Save() {
    updateProfilePhoto();
    modal.current?.dismiss('confirm');
  }
  
  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      setMessage(`Hello, ${ev.detail.data}!`);
    }
  }
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton id="open-modal" expand="block">
              <IonIcon icon={createOutline} size="large" />
            </IonButton>
          </IonButtons>
          <IonTitle class="ion-text-center">My Profile</IonTitle>
          <IonButtons slot="end">
            <IonToolbar>
              <IonButton onClick={handleLogout} >
                <IonIcon icon={logOutOutline} size="large" />
              </IonButton>
            </IonToolbar>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollEvents={true} scrollY={true}>
        <IonGrid style={{ overflowY: 'scroll', maxHeight: '100vh' }}>
          <IonRow>
            <IonCol class="ion-text-center">
            <IonAvatar
              style={{ width: '200px', height: '200px', padding: '15px', margin:'auto' }}
            >
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                />
              ) : (
                <IonIcon icon={personOutline} size="large" />
              )}
            </IonAvatar>
              <h1 style={{ fontSize: 'default', margin: '0' }}>{name || 'Unknown Name'}</h1>
              <span className="user-name">@{username || 'Unknown User'}</span>
            </IonCol>
          </IonRow>
          <div className='container'>
          {posts.length === 0 ? (
            <div className="no-posts-container">
              <p className="no-posts-message">No posts available</p>
              <IonRow>
                <IonCol>
                  <IonButton
                    onClick={handleCreatePostClick}
                    expand="full"
                    className="create-post-button"
                    shape='round'
                  >
                    Create Post
                  </IonButton>
                </IonCol>
              </IonRow>
            </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  data={{
                    userName: users[post.userId]?.username || 'Unknown User',
                    postTime: post.postedAt ? formatDistanceToNow(new Date(post.postedAt)) : 'Unknown time',
                    category: post.selectedCategory,
                    postTitle: post.title,
                    postContent: post.description,
                    location: post.location,
                    images: post.images || [],
                    postId: post.id, 
                    onEditClick: handleEditPostClick, 
                    onDeleteClick:handleDeletePost,
                  }}
                />
              ))
            )}
          </div>
        </IonGrid>
      </IonContent>

      <EditPostModal isOpen={!!editPostId} postId={editPostId} onClose={() => setEditPostId(null)} />

      {/* Modal Section */}
      <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
            </IonButtons>
            <IonTitle class="ion-text-center">My Profile</IonTitle>
            <IonButtons slot="end">
              <IonButton strong={true} onClick={() => Save()}>Save</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonGrid>
          <IonRow>
            <IonCol class="ion-text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files)}
                style={{ display: 'none' }}
                ref={fileInputRef}
              />
              <IonButton onClick={() => fileInputRef.current?.click()} shape="round" fill="clear">
                <IonAvatar
                  style={{ width: '200px', height: '200px', padding: '15px', margin:'auto' }}
                >
                  {profilePhotoUrl ? (
                    <img
                      src={profilePhotoUrl}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                    />
                  ) : (
                    <IonIcon icon={personOutline} size="large" />
                  )}
                </IonAvatar>
              </IonButton>
              <p style={{ fontSize: 'default' }}>Change Photo</p>
            </IonCol>
          </IonRow>

            <IonRow>
              <IonCol>
                <IonItem style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                  <IonInput
                    label="Username"
                    labelPlacement="floating"
                    placeholder="Enter username"
                    type="text"
                    onIonChange={handleUsernameChange}
                    value={username}>
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                  <IonInput
                    label="Name"
                    labelPlacement="floating"
                    placeholder="Enter name"
                    type="text"
                    onIonChange={handleNameChange}
                    value={name}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                  <IonInput
                    label="Email"
                    labelPlacement="floating"
                    placeholder="Enter email"
                    type="email"
                    errorText="Invalid email"
                    onIonInput={(event) => validate(event)}
                    onIonBlur={() => markTouched()}
                    onIonChange={handleEmailChange}
                    value={email}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol>
                <IonItem style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                  <IonInput
                    label="Password"
                    labelPlacement="floating"
                    placeholder="Enter password"
                    type="password"
                    onIonChange={handlePasswordChange}
                    value={password}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonModal>
    </IonPage>
  );
}

export default Profile;
