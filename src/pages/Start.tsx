import { IonButton, IonCol, IonContent, IonPage, IonRow } from '@ionic/react';
import logo from '../assets/img/app-logo.png';
import '../assets/css/start.css'

const Start: React.FC = () => (
    <IonPage>
		<div className='start-container'>
			<div className='container-1'>
				<div className='image-container'>
					<img src={logo} alt="Application Logo" className='application-logo' />
				</div>
				<div className='text-tagline'>
					<div className='text-tagline-1'>One BYTE at a TIME</div>
					<div className='text-tagline-2'>ZERO WASTE in MIND</div>
				</div>
			</div>
			<div className='container-2'>
				<IonButton 
					routerLink='/register' 
					expand="block"
					color={'tertiary'}
					shape='round'>
					Create an account
				</IonButton>
				<IonButton 
					routerLink='/login' 
					expand="block" 
					fill="outline"
					color={'tertiary'}
					shape='round'>
					Login
				</IonButton>
			</div>
		</div>
    </IonPage> 
  );

export default Start;