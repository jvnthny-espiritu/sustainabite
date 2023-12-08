import React, { useState, useEffect } from 'react';
import { IonAvatar, IonButton, IonIcon } from '@ionic/react';
import { mail } from 'ionicons/icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useHistory } from 'react-router-dom';

interface UserCardProps {
  userId: string;
  userName: string;
  postTime: string;
  category: string;
}

const UserCard: React.FC<UserCardProps> = ({ userId, userName, postTime, category }) => {
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      try {
        const userDoc = await firebase.firestore().collection('users').doc(userId).get();
        const photoUrl = userDoc.data()?.profilePhotoUrl || null;
        console.log('Fetched profile photo URL:', photoUrl);
        setProfilePhotoUrl(photoUrl);
      } catch (error) {
        console.error('Error fetching profile photo:', error);
      }
    };
  
    fetchProfilePhoto();
  }, [userId]);
  

  const handleMessage = () => {
    const recipient = userId; // Use userId as the recipient
    history.push(`/messages/${recipient}`);
  };

  return (
    <div className="user-info">
      <IonAvatar className="avatar">
        {profilePhotoUrl ? (
          <img alt="User's profile" src={profilePhotoUrl} />
        ) : (
          <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
        )}
      </IonAvatar>
      <div className="user-details">
        <span className="user-name">{userName}</span>
        <span className="post-time">{postTime}</span>
        <span className='category'>{category}</span>
      </div>
      <IonButton fill="clear" className="message-button" onClick={handleMessage}>
        <IonIcon aria-hidden="true" icon={mail} />
      </IonButton>
    </div>
  );
};

export default UserCard;
