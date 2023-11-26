import { IonButton, IonCol, IonContent, IonPage, IonRow } from '@ionic/react';
import logo from '../assets/img/app-logo.png';
import '../assets/css/start.css'

const Start: React.FC = () => (
    <IonPage>
      	<IonContent fullscreen className="ion-text-center" color={'primary'}>
		<div className='container'>
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
						className='ion-margin'
						expand="block"
						color={'tertiary'}
						shape='round'>
						Create an account
					</IonButton>
					<IonButton 
						routerLink='/login' 
						className='ion-margin'
						expand="block" 
						fill="outline"
						color={'tertiary'}
						shape='round'>
						Login
					</IonButton>
			</div>
			</div>
      	</IonContent>
    </IonPage> 
  );

export default Start;