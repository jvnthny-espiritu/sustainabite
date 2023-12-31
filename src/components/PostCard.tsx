import React from 'react';
import UserCard from './UserCard';
import PostDetails from './PostDetails';
import '../assets/css/card.css';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface PostCardProps {
  data: {
    userId: string; // Add userId to the data object
    userName: string;
    postTime: string;
    category: string;
    postTitle: string;
    postContent: string;
    location: string;
    images?: string[];
  };
}

const PostCard: React.FC<PostCardProps> = ({ data }) => (
  <div className="card">
    <div className="post">
      {/* Pass userId to the UserCard component */}
      <UserCard userId={data.userId} userName={data.userName} postTime={data.postTime} category={data.category} />
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
                <img key={index} src={image} alt={`Image ${index}`} className="post-image" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default PostCard;
