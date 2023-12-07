import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonAvatar, IonButton, IonIcon } from '@ionic/react';
import { mail } from 'ionicons/icons';

interface UserCardProps {
  userName: string;
  postTime: string;
  category: string;
}

const UserCard: React.FC<UserCardProps> = ({ userName, postTime, category }) => {
  const history = useHistory();

  const handleMessage = async () => {
    const recipient = 'tristan';
    history.push(`/messages/${recipient}`);
  };

  return (
    <div className="user-info">
      <IonAvatar className="avatar">
        <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
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