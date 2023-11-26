import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonGrid, IonRow } from '@ionic/react';
import logo from '../assets/img/app-logo.png';
import '../assets/css/home.css';
import PostCard from '../components/PostCard';

const Home: React.FC = () => {
  const sampledata = [
    {
      userName: 'Tristan Anyayahan',
      postTime: '2 hours ago',
      postTitle: 'Post Title 1',
      postContent: 'Post Content 1 goes here...',
      location: 'Batangas'
    },
    {
      userName: 'Caryll Labay',
      postTime: '3 hours ago',
      postTitle: 'Post Title 2',
      postContent: 'Post Content 2 goes here...',
      location: 'Batangas'
    },
    {
      userName: 'Princess May Tomongha',
      postTime: '4 hours ago',
      postTitle: 'Post Title 3',
      postContent: 'Post Content 3 goes here...',
      location: 'Batangas'
    },
    {
      userName: 'Jave Anthony Espiritu',
      postTime: '5 hours ago',
      postTitle: 'Post Title 4',
      postContent: 'Post Content 4 goes here...',
      location: 'Batangas'
    },
    {
      userName: 'Fiona Wanda Cueto',
      postTime: '6 hours ago',
      postTitle: 'Post Title 5',
      postContent: 'Post Content 5 goes here...',
      location: 'Batangas'
    }
  ];

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
          <div className="container">
            {sampledata.map((data, index) => (
              <PostCard key={index} data={data} />
            ))}
          </div>
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Home;