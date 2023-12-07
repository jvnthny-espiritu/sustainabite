import { IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonPage, IonRow, IonToolbar, IonBadge, IonSearchbar, IonList } from '@ionic/react';
import { personCircle } from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, where, or } from "firebase/firestore";
import '../assets/css/messages.css';
import {getUsername } from '../services/getUsername';
import { db } from '../firebase';

const Message: React.FC = () => {
  const history = useHistory();
  const userID = getUsername(); // changes based on user\
  const [contactList, setcontactList] = useState<{ username: string; lastMessage: string }[]>([]);
  //const unreadNum = 4;
  const [searchText, setSearchText] = useState('');
  const filteredData = contactList.filter(recipient => {
    const username = recipient.username || 'User';
    return username.toLowerCase().includes(searchText.toLowerCase());
  });

  const handleButtonClick = (recipient: string) => {
    history.push(`/messages/${recipient}`);
  };
  
  // read data
  useEffect(() => {
    const contacts = query(collection(db, "contacts"), or(
      where('userFrom', '==', userID),
      where('userTo', '==', userID),
      ), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(contacts, (querySnapshot) => {
      const newList: { username: string; lastMessage: string }[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const user = userID;
        const sender = data.userFrom;
        const reciever = data.userTo;
        let list = {
          username: '',
          lastMessage: '',
        };
        if(user === reciever){
          list = {
            username: sender,
            lastMessage: data.lastMessage,
          };
        } else if(user === sender){
          list = {
            username: reciever,
            lastMessage: data.lastMessage,
          };
        }
        newList.push(list);
      });
      setcontactList(newList);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  const renderRecipientList = (list: { username: string; lastMessage: string }[]) => {
    return (
    <IonList style={{ margin: "56px 0 0" }}>
      {list.map((recipient, index) => (
        <IonItem key={index} onClick={() => handleButtonClick(recipient.username)}>
          {/* <IonBadge slot="end">{unreadNum}</IonBadge> */}
          <IonGrid>
            <IonRow className='ion-align-items-center'>
              <IonCol size="2" className="ion-text-center">
                <IonIcon style={{ fontSize: "50px" }} icon={personCircle} />
              </IonCol>
              <IonCol size="10">
                <IonRow>
                  <IonCol>
                    <IonLabel>{recipient.username}</IonLabel>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <div style={{ fontSize: '10px' }}>{recipient.lastMessage}</div>
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonItem>
      ))}
    </IonList>);
};

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

        {searchText === '' ? renderRecipientList(contactList) : renderRecipientList(filteredData)}

      </IonContent>
    </IonPage>
  );
};

export default Message;
