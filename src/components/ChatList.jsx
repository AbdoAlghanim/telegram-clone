import React, { useEffect, useState } from 'react';
import {getFirestore} from 'firebase/firestore';

const ChatList = ({ selectChat }) => {
    const [chats, setChats] = useState([]);
  
    useEffect(() => {
      const unsubscribe = firestore.collection('chats').onSnapshot(snapshot => {
        const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChats(chatsData);
      });
  
      return () => unsubscribe();
    }, []);
  
    return (
      <div>
        <h2>Your Chats</h2>
        <ul>
          {chats.map(chat => (
            <li key={chat.id} onClick={() => selectChat(chat.id)}>
              {chat.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default ChatList;