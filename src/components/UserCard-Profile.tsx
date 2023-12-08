import React, { useState, useEffect } from 'react';
import { IonAvatar, IonButton, IonIcon, IonAlert } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

interface UserCardProps {
  userName: string;
  postTime: string;
  category: string;
}

const UserCard: React.FC<UserCardProps> = ({ userName, postTime, category }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  const handleOptions = () => {
    setShowOptions(true);
  };

  const handleDismiss = () => {
    setShowOptions(false);
  };

  useEffect(() => {
    const fetchProfilePhoto = async () => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        try {
          const userDoc = await firebase.firestore().collection('users').doc(currentUser.uid).get();
          const photoUrl = userDoc.data()?.profilePhotoUrl || null;
          setProfilePhotoUrl(photoUrl);
        } catch (error) {
          console.error('Error fetching profile photo:', error);
        }
      }
    };

    fetchProfilePhoto();
  }, []); // Empty dependency array to run the effect only once when the component mounts

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
      <IonButton fill="clear" className="message-button" onClick={handleOptions}>
        <IonIcon aria-hidden="true" icon={ellipsisVertical} />
      </IonButton>

      <IonAlert
        isOpen={showOptions}
        onDidDismiss={handleDismiss}
        header="Options"
        buttons={[
          {
            text: 'Edit',
            handler: () => { console.log('editing on process'); },
          },
          {
            text: 'Delete',
            role: 'destructive',
            handler: () => { console.log('deleting on process'); },
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => { console.log('canceled'); },
          },
        ]}
      />
    </div>
  );
};

export default UserCard;
