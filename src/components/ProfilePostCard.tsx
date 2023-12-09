import React, { useState } from 'react';
import UserCard from './UserCard-Profile';
import PostDetails from './PostDetails';
import { IonButton, IonIcon, IonAlert } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import '../assets/css/card.css';
import { pencil, trash } from 'ionicons/icons'; 

interface PostCardProps {
  data: {
    userName: string;
    postTime: string;
    category: string;
    postTitle: string;
    postContent: string;
    location: string;
    images: never[];
    postId: string;
    onEditClick: (postId: string) => void;
    onDeleteClick: (postId: string) => void;
  };
  children?: React.ReactNode; // Include the children prop
}


const PostCard: React.FC<PostCardProps> = ({ data }) =>  (
  <div className="card">
    <div className="post">
      <UserCard userName={data.userName} postTime={data.postTime} category={data.category} postId={''} onEditClick={function () : void {
        throw new Error('Function not implemented.');
      } }/>
      <div className="post-content">
        <h3>{data.postTitle}</h3>
        <p>{data.postContent}</p>
      </div>
      <PostDetails location={data.location} />
      {data.images && data.images.length > 0 && (
        <div className="post-image-container">
          <div className="image-container">
            <div className="horizontal-scroll">
              {data.images.map((image: string, index: number) => (
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <IonButton fill="clear" onClick={() => data.onEditClick(data.postId)}>
          <IonIcon aria-hidden="true" icon={pencil} />
          <span>Edit</span>
        </IonButton>
        <IonButton fill="clear" onClick={() => data.onDeleteClick(data.postId)}>
          <IonIcon aria-hidden="true" icon={trash} />
          <span>Delete</span>
        </IonButton>
      </div>

    </div>
  </div>
);

export default PostCard;
