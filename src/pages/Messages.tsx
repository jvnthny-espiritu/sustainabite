import { IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonPage, IonRow, IonToolbar, IonBadge, IonSearchbar, IonList } from '@ionic/react';
import { personCircle } from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import '../assets/css/messages.css';
import { db } from '../firebase';

const Message: React.FC = () => {
  const contacts = ['Lyney', 'Lynette', 'Freminet', 'Neuvillette', 'Furina', 'Wriothesley', 'Clorinde', 'Navia', 'Charlotte', 'Sigewinne'];
  //const contacts: string[] = [];
  const message = "(ex. lang dapat naka db) The quick brown fox jumps over the lazy dog. ";
  const unreadNum = 4;
  const history = useHistory();

  const [searchText, setSearchText] = useState('');
  const filteredData = contacts.filter(recipient => recipient.toLowerCase().includes(searchText.toLowerCase()));

  const handleButtonClick = (recipient: string) => {
    history.push(`/messages/${recipient}`);
  };

  // read data
  useEffect(() => {
    // (for add data) collection: contacts    name, last text, unreadNum???, profile img???
    const chats = query(collection(db, "messages"), where('ref', 'in', ['test1', 'test2']), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(chats, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const message = {
          text: data.text,
          isUser: data.isUser,
          timestamp: data.timestamp,
        };
      });
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  const renderRecipientList = (list: string[]) => (
    <IonList style={{ margin: "56px 0 0" }}>
      {list.map((recipient, index) => (
        <IonItem key={index} onClick={() => handleButtonClick(recipient)}>
          <IonBadge slot="end">{unreadNum}</IonBadge>
          <IonGrid>
            <IonRow className='ion-align-items-center'>
              <IonCol size="2" className="ion-text-center">
                <IonIcon style={{ fontSize: "50px" }} icon={personCircle} />
              </IonCol>
              <IonCol size="10">
                <IonLabel>
                  <IonLabel>{recipient}</IonLabel>
                  <div style={{ fontSize: '10px' }}>{message}</div>
                </IonLabel>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      ))}
    </IonList>
  );

  return (
    <IonPage>
      <IonContent fullscreen className="ion-text-center" style={{ overflow: "auto" }}>
        <IonToolbar className='fixed-top-content'>
          <div className="centered-content">
            <IonSearchbar
              showClearButton="focus" 
              color={"#004225"} 
              style={{ width: "80%", textAlign: "left", color: "#004225" }}
              value={searchText}
              onIonChange={(e) => setSearchText(e.detail.value!)}
              onIonClear={() => setSearchText('')}
            />
          </div>
        </IonToolbar>

        {searchText === '' ? renderRecipientList(contacts) : renderRecipientList(filteredData)}
      </IonContent>
    </IonPage>
  );
};

export default Message;
