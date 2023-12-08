// EditPostModal.tsx

import React, { useState, useEffect } from 'react';
import { IonModal, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

interface EditPostModalProps {
  isOpen: boolean;
  postId: string | null;
  onClose: () => void;
}

const EditPostModal: React.FC<EditPostModalProps> = ({ isOpen, postId, onClose }) => {
  const [editedData, setEditedData] = useState<{
    title: string;
    description: string;
    category: string;
    location: string;
    images: string[];
  }>({
    title: '',
    description: '',
    category: '',
    location: '',
    images: [],
  });

  useEffect(() => {
    const fetchPostData = async () => {
      if (postId) {
        const postDoc = await firebase.firestore().collection('posts').doc(postId).get();
        const postData = postDoc.data();
        if (postData) {
          setEditedData({
            title: postData.title || '',
            description: postData.description || '',
            category: postData.selectedCategory || '',
            location: postData.location || '',
            images: postData.images || [],
          });
        }
      }
    };

    fetchPostData();
  }, [postId]);

  const handleSaveChanges = async () => {
    if (postId) {
      try {
        await firebase.firestore().collection('posts').doc(postId).update({
          title: editedData.title,
          description: editedData.description,
          category: editedData.category,
          location: editedData.location,
          images: editedData.images,
        });
        onClose();
      } catch (error) {
        console.error('Error updating post:', error);
      }
    }
  };
  
  const handleImageUpload = (files: FileList | null) => {
    if (files && files.length > 0) {
      const selectedImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = URL.createObjectURL(file);
        selectedImages.push(imageUrl);
      }

      setEditedData({ ...editedData, images: selectedImages });
    }
  };

  const handleCancel = () => {
    onClose();
  };


  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="edit-post-modal">
      <IonHeader className="edit-post-modal-header">
        <IonToolbar>
          <IonTitle>Edit Post</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="edit-post-modal-content">
        <form className="edit-post-modal-form">
          <IonRow>
            <IonCol>
              <IonLabel className="edit-post-modal-label">Title</IonLabel>
              <input
                className="edit-post-modal-input"
                type="text"
                placeholder="Enter title"
                value={editedData.title}
                onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel className="edit-post-modal-label">Category</IonLabel>
              <input
                className="edit-post-modal-input"
                type="text"
                placeholder="Enter category"
                value={editedData.category}
                onChange={(e) => setEditedData({ ...editedData, category: e.target.value })}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel className="edit-post-modal-label">Description</IonLabel>
              <textarea
                className="edit-post-modal-textarea"
                placeholder="Enter description"
                value={editedData.description}
                onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel className="edit-post-modal-label">Location</IonLabel>
              <input
                className="edit-post-modal-input"
                type="text"
                placeholder="Enter location"
                value={editedData.location}
                onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
              />
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonLabel className="edit-post-modal-label">Upload Photos</IonLabel>
              <input
                className="edit-post-modal-image-upload"
                type="file"
                multiple
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              {editedData.images && editedData.images.length > 0 && (
                <div className="edit-post-modal-image-preview">
                  {editedData.images.map((imageUrl, index) => (
                    <img key={index} className="edit-post-modal-image" src={imageUrl} alt={`Image ${index}`} />
                  ))}
                </div>
              )}
            </IonCol>
          </IonRow>
        </form>

        <IonRow className="edit-post-modal-buttons">
          <IonCol className="edit-post-modal-save-btn">
            <IonButton onClick={handleSaveChanges}>Save Changes</IonButton>
          </IonCol>

          <IonCol className="edit-post-modal-cancel-btn">
            <IonButton onClick={handleCancel} color="danger">
              Cancel
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonModal>
  );
};
    
export default EditPostModal;
