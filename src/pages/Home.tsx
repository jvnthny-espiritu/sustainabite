import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonGrid, IonRow, IonAvatar, IonButton, IonIcon } from '@ionic/react';
import { locationOutline, timeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import '../assets/css/home.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { formatDistanceToNow } from 'date-fns';
import { useIonViewDidEnter } from '@ionic/react';
import PostCard from '../components/PostCard';
import logo from '../assets/img/app-logo-dark.png';
import '../assets/css/home.css';

interface UserData {
  username: string;
  name: string;
}

const Home: React.FC = () => {
  const history = useHistory();
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

  const navigateToChat = (recipient: string) => {
    history.push(`/messages/${recipient}`);
  };

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
            <PostCard 
              key={post.id}
              data={{
                userName: users[post.userId]?.username || 'Unknown User',
                postTime: post.postedAt ? formatDistanceToNow(new Date(post.postedAt)) : 'Unknown Time',
                category: post.selectedCategory,
                postTitle: post.title,
                postContent: post.description,
                location: post.location,
                images: post.images || []
              }} /> 
          ))};
        </main>
      </IonContent>
    </IonPage>
  );
};

export default Home;