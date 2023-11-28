import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonGrid, IonRow, IonAvatar, IonButton, IonIcon } from '@ionic/react';
import { locationOutline, timeOutline } from 'ionicons/icons';
import logo from '../assets/img/app-logo.png';
import '../assets/css/home.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import { formatDistanceToNow } from 'date-fns';
import { useIonViewDidEnter } from '@ionic/react';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<{ id: string, postedAt: string }[]>([]);

  useIonViewDidEnter(() => {
    const postsRef = firebase.database().ref('posts');

    const postsListener = postsRef.on('value', (snapshot) => {
      const postsData = snapshot.val();

      if (postsData) {
        const postsArray = Object.keys(postsData).map((key) => ({
          id: key,
          ...postsData[key],
        }));

        const sortedPosts = postsArray.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

        setPosts(sortedPosts);
      } else {
        setPosts([]);
      }
    });

    return () => postsRef.off('value', postsListener);
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
                <span className="user-name">User Name</span>
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
