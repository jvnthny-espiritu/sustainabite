import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonGrid, IonRow, IonAvatar, IonButton, IonIcon } from '@ionic/react';
import { locationOutline, timeOutline } from 'ionicons/icons';
import logo from '../assets/img/app-logo.png';
import '../assets/css/home.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { formatDistanceToNow } from 'date-fns';
import { useIonViewDidEnter } from '@ionic/react';

interface UserData {
  username: string;
  name: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<{ id: string; postedAt: string; userId: string }[]>([]);
  const [users, setUsers] = useState<{ [key: string]: UserData }>({});

  useIonViewDidEnter(() => {
    const postsRef = firebase.firestore().collection('posts');
    const usersRef = firebase.firestore().collection('users');
  
    // Fetch posts
    const postsListener = postsRef.onSnapshot((snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        postedAt: doc.data().postedAt, // Make sure this matches your Firestore field name
        ...doc.data(),
      }));
  
      const sortedPosts = postsData.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
  
      setPosts(sortedPosts);
    });
  
    // Fetch users
    const usersListener = usersRef.onSnapshot((snapshot) => {
      const usersData: { [key: string]: UserData } = {};
      snapshot.forEach((doc) => {
        usersData[doc.id] = doc.data() as UserData;
      });
      setUsers(usersData);
    });
  
    // Cleanup function
    return () => {
      // Unsubscribe from Firestore listeners
      postsListener(); // Unsubscribe from posts listener
      usersListener(); // Unsubscribe from users listener
    };
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow className="ion-justify-content-center ion-align-items-center">
              <img src={logo} alt="Application Logo" className="app-logo" />
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <main>
          {posts.map((post: any) => (
            <div key={post.id} className="post">
              <div className="user-info">
                <IonAvatar className="avatar">
                  <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                </IonAvatar>
                <div className="user-details">
                  <span className="user-name">{users[post.userId]?.username || 'Unknown User'}</span>
                  <span className="post-time">{post.postedAt ? formatDistanceToNow(new Date(post.postedAt)) : 'Unknown time'}</span>
                </div>
                <IonButton fill="clear" className="message-button">
                  Message
                </IonButton>
              </div>
              <div className="post-content">
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <p>Category: {post.selectedCategory}</p>
              </div>
              <div className="post-details">
                <div className="details-container">
                  <p className='details'>
                    <IonIcon icon={locationOutline} className='icon'/>{post.location} <IonIcon icon={timeOutline} className='icon'/> Expiration Date: {post.pickupTime}
                  </p>
                </div>
              </div>
              {post.images && post.images.length > 0 && (
                <div className="post-image-container">
                  <div className="image-container">
                    <div className="horizontal-scroll">
                      {post.images.map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Image ${index}`}
                          className="post-image"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Home;