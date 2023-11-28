import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonInput,  IonPage, IonRow, IonToast } from '@ionic/react';
import { caretBack } from "ionicons/icons";
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../assets/css/login.css'
import '../assets/css/form.css'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login: React.FC = () => {
  const [emailID, setEmailID] = useState('');
  const [password, setPassword] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const handleLogin =async () => {
    if (!validateEmail(emailID) || password.trim() === '') {
      console.error('Invalid email or password');
      setIsValid(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, emailID, password);
      console.log('Login Successful!');
      history.push('/');
    } catch (error) {
      setShowToast(true);
      console.error('Login Error: ', error);
    }
  }

  const validateEmail = (email: string) => {
    return email.match(
      /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    );
  };

  const validate = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;
    setIsValid(undefined);
    if (value === '') return;
    validateEmail(value) !== null ? setIsValid(true) : setIsValid(false);
  };

  const markTouched = () => { setIsTouched(true); };
  const handleBack = () => { history.goBack(); };

  return (
    <IonPage>
        <IonGrid class='login-grid'>
          <IonButton className="back-button" fill="clear" onClick={handleBack} size='small'>
            <IonIcon slot='start' icon={caretBack}/>
            <small>Back</small>
          </IonButton>
          <IonRow>
            <IonCol className='ion-text-center'> 
              <h1 className='login-title'>Welcome,</h1>
              <h3 className='login-subtitle'>Sign in to continue!</h3>
            </IonCol>
          </IonRow>
          <IonInput
              className={`login-input ${isValid && 'ion-valid'} ${isValid === false && 'ion-invalid'} ${isTouched && 'ion-touched'}`}
              label="Email ID"
              labelPlacement='floating'
              fill='outline'
              type="email"
              required
              errorText="Invalid email"
              onIonInput={(event) => validate(event)}
              onIonBlur={() => markTouched()}
              onIonChange={(e: any) => setEmailID(e.target.value)}>
          </IonInput>
          <IonInput
            label="Password"
            labelPlacement='floating'
            fill='outline'
            type="password"
            required
            onIonChange={(e: any) => setPassword(e.target.value)}>
          </IonInput>
          <IonRow>
            <IonCol className='ion-text-center'>
              <a href="#" className="forgot-password-link">Forgot Password?</a>
              <IonButton 
                expand="block"
                shape='round'
                className='login-button'
                onClick={handleLogin}>
                Login
              </IonButton>
              <p className="footer-text">Don't have an account? <a href='/register'>Sign Up</a></p>
            </IonCol>
          </IonRow>
        </IonGrid>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="User not found. Please check your email and try again."
        duration={3000}
        position="bottom"
        color="danger"
      />
    </IonPage>
  );
};

export default Login;