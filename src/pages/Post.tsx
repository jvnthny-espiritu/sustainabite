import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTextarea, IonThumbnail, IonTitle, IonToggle, IonToolbar } from '@ionic/react';
import { trash } from 'ionicons/icons';
import { useState } from 'react';
import '../assets/css/post.css';

const Post: React.FC = () => {
  const [images, setImages] = useState<FileList | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [includePickupTime, setIncludePickupTime] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');

  const handleUploadPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files).map((file) => URL.createObjectURL(file));
      setSelectedPhotos((prevPhotos) => [...prevPhotos, ...files]);
    }
  };

  const handleDeletePhoto = (index: number) => {
    const updatedPhotos = [...selectedPhotos];
    updatedPhotos.splice(index, 1);
    setSelectedPhotos(updatedPhotos);
  };


  const handleSubmit = () => {
    // Handle the submission of the food post data, including images, title, description, pickup time, and selected category.
    if (images) {
      console.log('Images:', images);
    }
    console.log('Title:', title);
    console.log('Location:', location);
    console.log('Description:', description);
    console.log('Pickup Time:', pickupTime);
    console.log('Selected Category:', selectedCategory);
  };
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="custom-text">Create Post</IonTitle>
          <IonButton
            className="custom-text"
            fill="outline"
            shape="round"
            slot="end"
            onClick={handleSubmit}>
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
                  <IonSelectOption value="surplus">Surplus</IonSelectOption>
                  <IonSelectOption value="donation">For Donation</IonSelectOption>
                  <IonSelectOption value="expiry_soon">Expiry Soon</IonSelectOption>
                  <IonSelectOption value="looking_for_food">Looking for Food</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonItem>
                <IonLabel>Pickup Time</IonLabel>
                <IonToggle
                  checked={includePickupTime}
                  onIonChange={() => setIncludePickupTime(!includePickupTime)}
                />
              </IonItem>
            </IonCol>
          </IonRow>

          {includePickupTime && (
            <IonRow>
            <IonCol>
              <IonItem className="custom-item">
                <IonLabel className="custom-label">Date & Time</IonLabel>
                <input
                  type="datetime-local"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="custom-input"
                />
              </IonItem>
            </IonCol>
          </IonRow>
          )}

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
                      <IonImg src={photo} />
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
