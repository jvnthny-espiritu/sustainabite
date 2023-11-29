import React from 'react';
import UserCard from './UserCard';
import PostDetails from './PostDetails';
import '../assets/css/card.css';

interface PostCardProps {
  data: {
    userName: string;
    postTime: string;
    postTitle: string;
    postContent: string;
    location: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ data }) => (
  <div className="card">
    <div className="post">
      <UserCard userName={data.userName} postTime={data.postTime} />
      <div className="post-content">
        <h3>{data.postTitle}</h3>
        <p>{data.postContent}</p>
      </div>
      <PostDetails location={data.location} />
    </div>
  </div>
);

export default PostCard;
