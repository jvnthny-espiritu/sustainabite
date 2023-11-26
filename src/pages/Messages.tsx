import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Messages: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar> 
      </IonHeader>
      <IonContent fullscreen>
      </IonContent>
    </IonPage>
  );
};

export default Messages;
