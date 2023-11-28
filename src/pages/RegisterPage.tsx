import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonPage, IonRow, IonToast } from '@ionic/react';
import { caretBack } from 'ionicons/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, getFirestore } from 'firebase/firestore';
import '../assets/css/register.css'
import '../assets/css/form.css'

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [emailID, setEmailID] = useState('');
  const [password, setPassword] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

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

  const markTouched = () => {
    setIsTouched(true);
  };

  const handleBack = () => {
    history.goBack(); 
  };

  const handleRegister = async () => {
    if (!validateEmail(emailID) || password.trim() === '') {
      console.error('Invalid email or password');
      setIsValid(false);
      setShowToast(true);
      return;
    }

    const auth = getAuth();
    const db = getFirestore();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailID, password);
      const { user } = userCredential;
      const usersCollection = collection(db, 'users');
      const userDoc = doc(usersCollection, user.uid); 
      await setDoc(userDoc, {
        id: user.uid,
        name: fullName,
        email: emailID,
        username: username,
        password: password
      });
      
      console.log('Registration Successful:', user.uid);
      history.push('/login'); 
    } catch (error) {
      console.error('Registration Error:', error);
      setShowToast(true);
    }
  };

  return (
    <IonPage>
        <IonGrid>
          <IonButton className="back-button" fill="clear" onClick={handleBack} size='small'>
            <IonIcon slot='start' icon={caretBack}/>
            <small>Back</small>
          </IonButton>
          <IonRow>
            <IonCol class="ion-text-center">
              <h1 className='reg-title'>Create Account</h1>
              <h3 className='reg-subtitle'>Sign up to get started!</h3>
            </IonCol>
          </IonRow>
          <IonInput
              label="Full Name"
              labelPlacement='floating'
              type="text"
              fill='outline'
              className='reg-input'
              onIonChange={(e: any) => setFullName(e.target.value)}>
          </IonInput>
          <IonInput
              label="Username"
              labelPlacement='floating'
              type="text"
              fill='outline'
              className='reg-input'
              onIonChange={(e: any) => setUsername(e.target.value)}>
          </IonInput>
          <IonInput
              className={`reg-input ${isValid && 'ion-valid'} ${isValid === false && 'ion-invalid'} ${isTouched && 'ion-touched'}`}
              label="Email ID"
              labelPlacement='floating'
              type="email"
              fill='outline'
              errorText="Invalid email"
              onIonInput={(event) => validate(event)}
              onIonBlur={() => markTouched()}
              onIonChange={(e: any) => setEmailID(e.target.value)}>
          </IonInput>
          <IonInput
            label="Password"
            labelPlacement='floating'
            type="password"
            fill='outline'
            onIonChange={(e: any) => setPassword(e.target.value)}>
          </IonInput>
          <IonRow>
            <IonCol class="centered-content">
              <IonButton 
                expand="block" 
                shape='round'
                className="reg-button"
                onClick={handleRegister}>
                Create Account
              </IonButton>
              <p className='footer-text'>Already have an account? <a href="/login">Login</a></p>
            </IonCol>
          </IonRow>
        </IonGrid>
      <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message="Invalid email or password. Please check your input and try again."
            duration={3000}
            position="bottom"
            color="danger"
          />
    </IonPage>
  );
};

export default Register;