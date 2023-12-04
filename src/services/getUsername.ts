import { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const useUsername = (): string | null => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Assuming you have a 'users' collection in Firestore with user data
        const userRef = firebase.firestore().collection('users').doc(user.uid);
        const fetchUsername = async () => {
          try {
            const userDoc = await userRef.get();
            const usernameFromFirestore = userDoc.data()?.username || 'Unknown User';
            setUsername(usernameFromFirestore);
          } catch (error) {
            console.error('Error fetching username:', error);
          }
        };
        fetchUsername();
      }
    });


    return () => {
      unsubscribe();
    };
  }, []);

  return username;
};
