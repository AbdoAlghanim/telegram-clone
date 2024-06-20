import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const ChatList = ({ selectChat }) => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const user = auth.currentUser;
      const q = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
      const querySnapshot = await getDocs(q);
      const chatData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatData);
    };

    fetchChats();
  }, []);
  return (
    <div>
      <h2>Your Chats</h2>
      <ul>
        {chats.map((chat) => (
          <li key={chat.id} onClick={() => selectChat(chat.id)}>
            {chat.id}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;