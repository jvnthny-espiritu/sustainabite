import { IonButton, IonContent, IonIcon, IonLabel, IonPage, IonToolbar, IonButtons, IonCard } from '@ionic/react';
import { personCircle } from "ionicons/icons";
import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { send, arrowBack } from 'ionicons/icons';
import { collection, query, onSnapshot, doc, addDoc, setDoc, getDoc, serverTimestamp, FieldValue, where, or, orderBy, getDocs, updateDoc } from "firebase/firestore";
import '../assets/css/messages.css';
import {getUsername } from '../services/getUsername';
import { db } from '../firebase';

const Chat: React.FC = () => {
  const history = useHistory();
  const user = getUsername(); // changes based on user
  const { recipient } = useParams<{ recipient: string }>(); //change based on recipient
  let sender = '';
  let reciever = '';
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: any }[]>([]);
  const [myMap, setMyMap] = useState<Map<any, any>>(new Map());
  const contactCollection = collection(db, 'contacts');
  const [documentId, setdocumentId] = useState<string>('');

  // read contact list
  useEffect(() => {
    const contacts = query(collection(db, "contacts"), or(
      where('userFrom', '==', user),
      where('userTo', '==', user),
      ), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(contacts, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sender = data.userFrom;
        reciever = data.userTo;
      });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // read text messages
  useEffect(() => {
    console.log("documentId", documentId);
    const chats = query(collection(db, "messages"), where('id', '==', documentId), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(chats, (querySnapshot) => {
      const newMessages: { text: string; sender: string; timestamp: any }[] = [];
      const newMyMap = new Map<string, any>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const message = {
          text: data.text,
          sender: data.sender,
          timestamp: data.timestamp,
        };
        newMessages.push(message);
        newMyMap.set(doc.id, message);
      });
  
      setMessages(newMessages);
      setMyMap(newMyMap);
      console.log("messages", messages);
      return () => unsubscribe();
    });
  }, []);

  // add text messages
  const addMessage = async () => {
    if (inputValue.trim() !== '') {
      try {
        const messagesCollection = collection(db, 'messages');
        const documentId = await contactList(inputValue);
  
        await addDoc(messagesCollection, {
          id: documentId,
          text: inputValue,
          sender: user,
          timestamp: serverTimestamp(),
        });
  
        setInputValue('');
      } catch (error) {
        console.error('Error adding message:', error);
      }
    }
  };

  // add to contact list
  const contactList = async (lastMessage: string): Promise<string> => {
    const querySnapshot = await getDocs(
      query(contactCollection,
        or((where('userFrom', '==', user), where('userTo', '==', recipient)),
           (where('userTo', '==', user), where('userFrom', '==', recipient))),
      )
    );
  
    if (querySnapshot.docs.length > 0) {
      // If both user and recipient are found
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        lastMessage: lastMessage,
        timestamp: serverTimestamp(),
      });

      setdocumentId(docRef.id);
    } else {
      // If not found, add a new document to the contact collection
      const contactCollectionRef = await addDoc(contactCollection, {
        userFrom: user,
        userTo: recipient,
        lastMessage: lastMessage,
        timestamp: serverTimestamp(),
      });
      setdocumentId(contactCollectionRef.id);
      await updateDoc(contactCollectionRef, { id: documentId });
      console.log('Contact added successfully!');
    }
    return(documentId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value as string;
    const sanitizedValue = newValue.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    setInputValue(sanitizedValue);
  };

  const handleGoBack = () => {
    history.push('/messages');
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='fixed-top-content'>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={handleGoBack} style={{ color: "#004225" }}><IonIcon icon={arrowBack} /></IonButton>
            </IonButtons>
          </IonToolbar>

          <IonCard className='name-card'>
            <IonIcon style={{ fontSize: "50px" }} icon={personCircle} />
            <IonLabel style={{ fontSize: '16px', padding: "10px" }}>{recipient}</IonLabel>
          </IonCard>
        </div>

        <div className='chat-container'>
          {messages.map((message, index) => {
            var isUserMessage: boolean;
            if (message.sender === user) {
              isUserMessage = true;
            } else {
              isUserMessage = false;
            }

            const maxLineLength = 40;
            const lines = [];
            for (let i = 0; i < message.text.length; i += maxLineLength) {
              lines.push(message.text.substr(i, maxLineLength));
            }
            return (
              <div key={index} className={`chat-bubble ${isUserMessage ? 'chat-user' : 'chat-recipient'}`}>
                {lines.map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))}
              </div>
            );
          })}
        </div>
      </IonContent>

      <IonToolbar>
        <div style={{ display: "flex", alignItems: "center" }}>
          <textarea
            placeholder="Type something..."
            onChange={(e) => handleInputChange(e)}
            value={inputValue}
            spellCheck="false"
            style={{
              flex: 1,
              border: "1px solid #004225",
              borderRadius: "5px",
              padding: "8px",
              margin: "10px",
              whiteSpace: 'pre-wrap',
              backgroundColor: "#fff",
              color: "#004225"
            }}
          ></textarea>
          <IonButton onClick={addMessage}>
            <IonIcon slot="icon-only" icon={send}></IonIcon>
          </IonButton>
        </div>
      </IonToolbar>
    </IonPage>
  );
};

export default Chat;
