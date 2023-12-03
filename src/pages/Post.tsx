import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton, IonToolbar, IonTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTextarea, IonThumbnail, IonToggle, IonToast,IonAlert } from '@ionic/react';
import { trash } from 'ionicons/icons';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import '../assets/css/post.css';
import { config } from '../firebase';

firebase.initializeApp(config);

const storage = firebase.storage();

const Post: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<any>(null); // Added user state
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleUploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      const uploadPromises = files.map(async (file) => {
        const imageRef = storage.ref().child(`images/${file.name}`);
        await imageRef.put(file);
        return imageRef.getDownloadURL();
      });

      try {
        const downloadURLs = await Promise.all(uploadPromises);
        setSelectedPhotos((prevPhotos) => [...prevPhotos, ...downloadURLs]);
      } catch (error) {
        console.error('Error uploading images:', error);
      }
    }
  };

  const handleDeletePhoto = (index: number) => {
    const updatedPhotos = [...selectedPhotos];
    updatedPhotos.splice(index, 1);
    setSelectedPhotos(updatedPhotos);
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error('User not authenticated');
      setShowToast(true);
      return;
    }

    // Check if required fields are empty
    if (!title || !location || !description || !selectedCategory) {
      console.error('Please fill in all required fields');
      // Show a modal to inform the user about missing information
      setShowMissingFieldsModal(true);
      return;
    }
  
    const postData = {
      userId: user.uid,
      title,
      location,
      description,
      selectedCategory,
      images: selectedPhotos,
      postedAt: new Date().toISOString(),
    };
  
    try {
      const postsRef = collection(getFirestore(), 'posts');
      const newPostDoc = doc(postsRef);
  
      await setDoc(newPostDoc, postData);
  
      // Reset form fields after successful submission
      setTitle('');
      setLocation('');
      setDescription('');
      setSelectedCategory('');
      setSelectedPhotos([]);
  
      history.push('/home');
      history.push(`/home/${newPostDoc.id}`);
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };
  


  return (
    <IonPage>

      <IonAlert
        isOpen={showMissingFieldsModal}
        onDidDismiss={() => setShowMissingFieldsModal(false)}
        header="Missing Fields"
        message="Please fill in all required fields (Title, Location, Description, and Category)."
        buttons={['OK']}
      />


      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="User not authenticated. Please log in and try again."
        duration={3000}
        position="bottom"
        color="danger"
      />

      <IonHeader>
        <IonToolbar>
          <IonTitle className="custom-text">Create Post</IonTitle>
          <IonButton className="custom-text" fill="outline" shape="round" slot="end" onClick={handleSubmit}>
            Post
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-text-center ion-content-fullscreen">
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput
                  value={title}
                  onIonChange={(e) => setTitle(e.detail.value!)}
                  label="Title"
                  labelPlacement="floating"
                  placeholder="Enter title here"
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput
                  label="Location"
                  labelPlacement="floating"
                  value={location}
                  onIonChange={(e) => setLocation(e.detail.value!)}
                  placeholder="Enter your location"
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel position="floating">Description</IonLabel>
                <IonTextarea
                  value={description}
                  onIonChange={(e) => setDescription(e.detail.value!)}
                  autoGrow
                  rows={5}
                  placeholder="Enter details about the items"
                  style={{ borderBottom: 'none' }}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Category</IonLabel>
                <IonSelect
                  value={selectedCategory}
                  placeholder="Select here"
                  onIonChange={(e) => setSelectedCategory(e.detail.value)}
                >
                  <IonSelectOption value="Excess/Extra Food">Excess/Extra Food</IonSelectOption>
                  <IonSelectOption value="Donation">Donation</IonSelectOption>
                  <IonSelectOption value="Expiry Soon">Expiry Soon</IonSelectOption>
                  <IonSelectOption value="Looking for Food">Looking for Food</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Upload Photos</IonLabel>
                <label htmlFor="fileInput" className="custom-file-upload">
                  Choose File
                </label>
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleUploadPhoto}
                  multiple
                  style={{ display: 'none' }}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          {selectedPhotos.length > 0 && (
            <IonRow>
              <IonCol>
                <IonLabel>Selected Photos</IonLabel>
                <div className="photo-container">
                  {selectedPhotos.map((photo, index) => (
                    <IonThumbnail
                      key={index}
                      onClick={() => handleDeletePhoto(index)}
                      className="photo-thumbnail"
                    >
                      <img src={photo} alt={`Image ${index}`} />
                      <IonIcon icon={trash} className="delete-icon" />
                    </IonThumbnail>
                  ))}
                </div>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Post;
