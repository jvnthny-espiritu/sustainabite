import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { settingsOutline, personOutline, ellipsisVertical, locationOutline, timeOutline } from 'ionicons/icons';
import { useRef, useState } from 'react';
import '../assets/css/card.css'

const Profile: React.FC = () => {
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
    
  const markTouched = () => { setIsTouched(true); };
  const handleUsernameChange = (event: CustomEvent) => { setUsername(event.detail.value || ''); };
  const handleNameChange = (event: CustomEvent) => { setName(event.detail.value || ''); };
  const handleEmailChange = (event: CustomEvent) => { setEmail(event.detail.value || ''); };
  const handlePasswordChange = (event: CustomEvent) => { setPassword(event.detail.value || ''); };
  const [message, setMessage] = useState( 'This modal example uses triggers to automatically open a modal when the button is clicked.' );
  function Save() { modal.current?.dismiss(input.current?.value, 'confirm'); }
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
          <IonToolbar >
            <IonTitle class="centered-content">My Profile</IonTitle>
            <IonButton slot='end' expand="block" fill='clear' color='dark'>
              <IonIcon icon={settingsOutline} size='large'/>
            </IonButton>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonGrid>
            <IonRow className="ion-justify-content-center ion-align-items-center">
              <IonCol>
                <IonButton 
                  custom-large-button
                  shape="round"
                  className="white-text"
                  style={{ width: '150px', height: '150px', padding: '10px'}}>
                  <IonIcon icon={personOutline} size="large"/>
                </IonButton>
                <h1>Name</h1>
                <p>@username</p>
              </IonCol>
            </IonRow>
            <div className='container'>
            {sampledata.map((data, index) => (
              <div className='card'  key={index}>
                <div className="post">
                  <div className="user-info">
                    <IonAvatar className="avatar">
                      <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
                    </IonAvatar>
                    <div className="user-details">
                      <span className="user-name">{data.userName}</span>
                      <span className="post-time">{data.postTime}</span>
                    </div>
                    <IonButton fill="clear" className="message-button">
                      <IonIcon icon={ellipsisVertical}/>
                    </IonButton>
                  </div>
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
        <p>{message}</p>
        <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle class="centered-content">My Profile</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => Save()}>Save</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol class="centered-content">
              <IonButton
                routerLink="/change-profile-photo"
                custom-large-button
                shape="round"
                size="large"
                className="white-text"
                style={{ width: '155px', height: '155px', padding: '10px' }}>
                <IonIcon icon={personOutline} size='large'/>
              </IonButton>
              <p style={{ fontSize: "default"}}>Change Photo</p>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
                <IonInput
                  label="Username"
                  labelPlacement="floating"
                  placeholder="Enter username"
                  type="text"
                  onIonChange={handleUsernameChange}
                  value={username}
                ></IonInput>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonItem>
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
              <IonItem>
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
              <IonItem>
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
          <IonRow>
            <IonCol class="centered-content">
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
