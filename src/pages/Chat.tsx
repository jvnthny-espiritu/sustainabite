import { IonButton, IonContent, IonIcon, IonLabel, IonPage, IonToolbar, IonButtons, IonCard } from '@ionic/react';
import { personCircle } from "ionicons/icons";
import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { send, arrowBack } from 'ionicons/icons';
import { collection, query, onSnapshot, doc, addDoc, setDoc, getDoc, serverTimestamp, FieldValue, where, orderBy, getDocs } from "firebase/firestore";
import '../assets/css/messages.css';
import { db } from '../firebase';

const Chat: React.FC = () => {
  const history = useHistory();
  const userID = "Aether"; // change based on user
  const { recipient } = useParams<{ recipient: string }>(); //change based on recipient
  const messageID1 = userID + recipient;
  const messageID2 = recipient + userID;
  const [inputValue, setInputValue] = useState<string>('');
  const [messages, setMessages] = useState<{ text: string; isUser: string; timestamp: any }[]>([]);
  const [myMap, setMyMap] = useState<Map<any, any>>(new Map());

  // read text messages
  useEffect(() => {
    const chats = query(collection(db, "messages"), where('ref', 'in', [messageID1, messageID2]), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(chats, (querySnapshot) => {
      const newMessages: { text: string; isUser: string; timestamp: any }[] = [];
      const newMyMap = new Map<string, any>();
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const message = {
          text: data.text,
          isUser: data.isUser,
          timestamp: data.timestamp,
        };
        newMessages.push(message);
        newMyMap.set(doc.id, message);
      });
  
      setMessages(newMessages);
      setMyMap(newMyMap);
      return () => unsubscribe();
    });
  
    
  }, []);

  // add text messages
  const addMessage = async () => {
    if (inputValue.trim() !== '') {
      try {
        const newMessageRef = await addDoc(collection(db, "messages"), {
          ref: messageID1,
          text: inputValue,
          isUser: userID,
          timestamp: serverTimestamp(),
        });

        // Use a separate query to fetch the data of the newly created document
        const newMessageSnapshot = await getDoc(newMessageRef);
        const { text } = newMessageSnapshot.data() as { text: string };

        contactList(text);

        setInputValue('');
      } catch (error) {
        console.error('Error adding message:', error);
      }
    }
  };

  // add to contact list
  const contactList = async (lastMessage: string) => {
    await setDoc(doc(db, "contacts", recipient), {
      username: recipient,
      lastMessage: lastMessage,
      timestamp: serverTimestamp(),
    });
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
            if (message.isUser === userID) {
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
