import React, { useState, useEffect } from 'react';
import { IonButtons,IonModal, IonLabel, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonButton, IonInput, IonItem, IonTextarea, IonSelect, IonSelectOption } from '@ionic/react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import '../assets/css/editpost.css';

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
          <IonButtons slot="start">
            <IonButton onClick={handleCancel}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Edit Post</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSaveChanges}>Save</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="edit-post-modal-content ion-text-center ion-content-fullscreen">
      <form className="edit-post-modal-form">
          <IonItem>
            <IonLabel position="floating">Title</IonLabel>
            <IonInput
              value={editedData.title}
              onIonChange={(e) => setEditedData({ ...editedData, title: e.detail.value! })}
              placeholder="Enter title here"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Category</IonLabel>
            <IonSelect
              value={editedData.category}
              onIonChange={(e) => setEditedData({ ...editedData, category: e.detail.value! })}>
              <IonSelectOption value="Excess/Extra Food">Excess/Extra Food</IonSelectOption>
              <IonSelectOption value="Donation">Donation</IonSelectOption>
              <IonSelectOption value="Expiry Soon">Expiry Soon</IonSelectOption>
              <IonSelectOption value="Looking for Food">Looking for Food</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Description</IonLabel>
            <IonTextarea
              value={editedData.description}
              onIonChange={(e) => setEditedData({ ...editedData, description: e.detail.value! })}
              autoGrow
              rows={5}
              placeholder="Enter description here"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Location</IonLabel>
            <IonInput
              value={editedData.location}
              onIonChange={(e) => setEditedData({ ...editedData, location: e.detail.value! })}
              placeholder="Enter location here"
            />
          </IonItem>

          <IonItem>
            <IonLabel>Upload Photos</IonLabel>
            <label htmlFor="fileInput" className="custom-file-upload">
              Choose File
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              multiple
              style={{ display: 'none' }}
            />
          </IonItem>
          <div className="photo-container">
              {editedData.images && editedData.images.length > 0 && (
                <div className="photo-container">
                  {editedData.images.map((imageUrl, index) => (
                    <img key={index} className="photo-thumbnail" src={imageUrl} alt={`Image ${index}`} />
                  ))}
                </div>
              )}
            </div>
        </form>
      </IonContent>
    </IonModal>
  );
};
    
export default EditPostModal;