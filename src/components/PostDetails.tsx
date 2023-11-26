import React from 'react';
import { IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';


interface PostDetailsProps {
  location: string;
}

const PostDetails: React.FC<PostDetailsProps> = ({ location }) => (
  <div className="post-details">
    <div className="details-container">
      <p className="details">
        <IonIcon icon={locationOutline} className="icon" /> {location}{' '}
      </p>
    </div>
  </div>
);

export default PostDetails;
