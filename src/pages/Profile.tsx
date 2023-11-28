import  { useState, useRef} from 'react';
import {IonButtons,IonCol,IonGrid,IonRow,IonButton,IonModal,IonHeader,IonContent,IonToolbar,IonTitle,IonPage,IonItem,IonInput,IonIcon,IonAvatar,} from '@ionic/react';
import {locationOutline, personOutline, createOutline, timeOutline,ellipsisVertical,logOutOutline } from 'ionicons/icons'; // Import the settings icon
import { OverlayEventDetail } from '@ionic/core/components';


function Profile() {
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
    
  const validateEmail = (email: string) => {
  return email.match(
    /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zAZ0-9-]{0,61}[a-zAZ0-9])?)*$/
  );
  };
    
  const validate = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;
    setIsValid(undefined);
    
    if (value === '') return;
    
    validateEmail(value) !== null ? setIsValid(true) : setIsValid(false);
  };
  const markTouched = () => {
    setIsTouched(true);
  };
  const handleUsernameChange = (event: CustomEvent) => {
    setUsername(event.detail.value || '');
  };
  const handleNameChange = (event: CustomEvent) => {
    setName(event.detail.value || '');
  };
  const handleEmailChange = (event: CustomEvent) => {
    setEmail(event.detail.value || '');
  }; 
  const handlePasswordChange = (event: CustomEvent) => {
    setPassword(event.detail.value || '');
  };
  const [message, setMessage] = useState(
    'This modal example uses triggers to automatically open a modal when the button is clicked.'
  );
  function Save() {
    modal.current?.dismiss(input.current?.value, 'confirm');
  }
  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      setMessage(`Hello, ${ev.detail.data}!`);
    }
  }
  const sampledata = [
    {
      userName: 'Name',
      postTime: '2 hours ago',
      postTitle: 'Post Title 1',
      postContent: 'Post Content 1 goes here...',
      location: 'Batangas',
      expirationDate: '12/31/2023'
    },
    {
      userName: 'Name ',
      postTime: '3 hours ago',
      postTitle: 'Post Title 2',
      postContent: 'Post Content 2 goes here...',
      location: 'Batangas',
      expirationDate: '12/31/2023'
    },
  ];
  return (
    <IonPage>
      <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton id="open-modal" expand="block">
            <IonIcon icon={createOutline} size="large"/>
            </IonButton>
          </IonButtons>
          <IonTitle class="ion-text-center">My Profile</IonTitle>
          <IonButtons slot="end">
            <IonToolbar>
              <IonButton>
            <IonIcon icon={logOutOutline} size="large"/>
            </IonButton>
          </IonToolbar>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
  <IonGrid>
    <IonRow>
    <IonCol class="ion-text-center">
              <IonButton
                routerLink="/change-profile-photo"
                custom-large-button
                shape="round"
                size="large"
                className="white-text"
                style={{ width: '155px', height: '155px',padding: '10px' }}>
                <IonIcon icon={personOutline} size='large'/>
              </IonButton>
              <h1 style={{ fontSize: 'default', margin: '0' }}>Name</h1>
              <p style={{ fontSize: 'default', margin: '0' }}>@username</p>
            </IonCol>
    </IonRow>
                  <div className='container'>
        
          {sampledata.map((data, index) => (
          <div className='card'  key={index}>
          <div className="post">
            <div className="user-info">
              <IonAvatar className="avatar">
                <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg
" />
              </IonAvatar>
              <div className="user-details">
                <span className="user-name">{data.userName}</span>
                <span className="post-time">{data.postTime}</span>
              </div>
              <IonButton fill="clear" className="message-button">
              <IonIcon icon={ellipsisVertical}/>
              </IonButton>
            </div>
            <div className="post-content"></div>
            <div className="post-content">
              <h3>{data.postTitle}</h3>
              <p>{data.postContent}</p>
            </div>
            <div className="post-details">
              <div className="details-container">
                <p className='details'>
                  <IonIcon icon={locationOutline} className='icon'/> {data.location} <span className='divider'>|</span>  <IonIcon icon={timeOutline} className='icon'/> Expiration Date: {data.expirationDate}</p>
              </div>
            </div>
          </div>
          </div>
            ))}
            </div>
                </IonGrid>
              </IonContent>
      </IonPage>
      <IonContent className="ion-padding">
        <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle class="ion-text-center">My Profile</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => Save()}>Save</IonButton>
              </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol class="ion-text-center">
              <IonButton
                routerLink="/change-profile-photo"
                custom-large-button
                shape="round"
                size="large"
                className="white-text"
                style={{ width: '155px', height: '155px',padding: '10px' }}>
                <IonIcon icon={personOutline} size='large'/>
              </IonButton>
              <p style={{ fontSize: "default"}}>
                  Change Photo
              </p>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
                <IonInput
                label="Username"
                labelPlacement="floating"
                placeholder="Enter username"
                type="text"
                onIonChange={handleUsernameChange}
                value={username}>
                </IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
 <IonRow>
   <IonCol>
    <IonItem style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
      <IonInput
        label="Name"
        labelPlacement="floating"
        placeholder="Enter name"
        type="text"
        onIonChange={handleNameChange}
        value={name}
      ></IonInput>
    </IonItem>
  </IonCol>
</IonRow>
<IonRow>
  <IonCol>
    <IonItem style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
      <IonInput
        label="Email"
        labelPlacement="floating"
        placeholder="Enter email"
        type="email"
        errorText="Invalid email"
        onIonInput={(event) => validate(event)}
        onIonBlur={() => markTouched()}
        onIonChange={handleEmailChange}
        value={email}
      ></IonInput>
    </IonItem>
  </IonCol>
</IonRow>
<IonRow>
  <IonCol>
    <IonItem style={{ border: '1px solid #ccc', borderRadius: '8px' }}>
      <IonInput
        label="Password"
        labelPlacement="floating"
        placeholder="Enter password"
        type="password"
        onIonChange={handlePasswordChange}
        value={password}
      ></IonInput>
    </IonItem>
  </IonCol>
</IonRow>
        </IonGrid>
      </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>);
}
export default Profile;
