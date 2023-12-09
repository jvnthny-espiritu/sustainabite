import React from 'react';
import UserCard from './UserCard-Profile';
import PostDetails from './PostDetails';
import { IonButton } from '@ionic/react';
import '../assets/css/card.css';

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
  children?: React.ReactNode;
}


const PostCard: React.FC<PostCardProps> = ({ data }) =>  (
  <div className="card">
    <div className="post">
      <UserCard userName={data.userName} postTime={data.postTime} category={data.category} postId={data.postId} />
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
      <IonButton onClick={() => data.onEditClick(data.postId)}>Edit</IonButton>
      <IonButton onClick={() => data.onDeleteClick(data.postId)}>Delete</IonButton>
    </div>
  </div>
);

export default PostCard;
