import React, { useState, useEffect, useRef } from 'react';
import { IonButtons, IonCol, IonContent, IonGrid, IonRow, IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonPage, IonItem, IonInput, IonIcon, IonAvatar, IonAlert } from '@ionic/react';
import { formatDistanceToNow } from 'date-fns';
import { locationOutline, personOutline, createOutline, timeOutline, ellipsisVertical, logOutOutline } from 'ionicons/icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { OverlayEventDetail } from '@ionic/core/components';
import PostCard from '../components/ProfilePostCard';

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
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);
  const currentUser = firebase.auth().currentUser;

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

  const openModal = () => {
    modal.current?.present();
    setModalUsername(username);
    setModalName(name);
    setModalEmail(email);
    setModalPassword('');
  };


  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user) {
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

            const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
            const usernameFromFirestore = userDoc.data()?.username;

            setUsername(usernameFromFirestore || 'Unknown User');
          });

        return () => {
          userPostsListener();
        };
      }
    };

    fetchUserPosts();
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await firebase.firestore().collection('users').doc(user.uid).get();
          const nameFromFirestore = userDoc.data()?.name;

          setName(nameFromFirestore || 'Unknown Name');
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
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

  const handleNameChange = (event: CustomEvent) => {
    setName(event.detail.value || '');
  };

  const handleEmailChange = (event: CustomEvent) => {
    setEmail(event.detail.value || '');
  };

  const handlePasswordChange = (event: CustomEvent) => {
    setPassword(event.detail.value || '');
  };

  const [message, setMessage] = useState('This modal example uses triggers to automatically open a modal when the button is clicked.');

  function Save() {
    modal.current?.dismiss(input.current?.value, 'confirm');
    
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
              <IonButton>
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
              <IonButton routerLink="/change-profile-photo" custom-large-button shape="round" size="large" className="white-text" style={{ width: '155px', height: '155px', padding: '10px' }}>
                <IonIcon icon={personOutline} size='large' />
              </IonButton>
              <h1 style={{ fontSize: 'default', margin: '0' }}>{name || 'Unknown Name'}</h1>
              <span className="user-name">@{username || 'Unknown User'}</span>
            </IonCol>
          </IonRow>
          <div className='container'>
            {posts.map((post) => (
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
                }} />
            ))}
          </div>
        </IonGrid>
      </IonContent>

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
                <IonButton
                  routerLink="/change-profile-photo"
                  custom-large-button
                  shape="round"
                  size="large"
                  className="white-text"
                  style={{ width: '155px', height: '155px', padding: '10px' }}>
                  <IonIcon icon={personOutline} size='large' />
                </IonButton>
                <p style={{ fontSize: "default"}}>
                  Change Photo
                </p>
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