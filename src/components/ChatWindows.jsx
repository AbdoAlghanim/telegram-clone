import React, { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase'
import SendMessage from './SendMessage';

const ChatWindow = ({ selectedChat }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (selectedChat) {
      const fetchMessages = async () => {
        const q = query(collection(db, 'chats', selectedChat, 'messages'), orderBy('timestamp', 'asc'));
        const querySnapshot = await getDocs(q);
        const messageData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(messageData);
      };

      fetchMessages();
    }
  }, [selectedChat]);

  return (
    <div>
      <h2>Chat Window</h2>
      <ul>
        {messages.map(message => (
          <li key={message.id}>
            <strong>{message.senderName}: </strong>{message.text}
          </li>
        ))}
      </ul>
      <SendMessage selectedChat={selectedChat} />
    </div>
  );
};

export default ChatWindow;
