import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Logout from './LogOut';
import UserNameFromUid from './UserNameFromUid';

const ChatList = ({ selectChat }) => {
  const [chats, setChats] = useState([]);
  const user = auth.currentUser;
  const suggestedUsers = [
    { id: 'CdHuk5cymnfUnEZPlwOS3geWubh1', name: 'Abdulwahhab, creator of Telegram Clone' }
    // Add more suggested users as needed
  ];

  useEffect(() => {
    const fetchChats = async () => {
      const q = query(collection(db, 'chats'), where('participants', 'array-contains', user.uid));
      const querySnapshot = await getDocs(q);
      const chatData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatData);
    };

    fetchChats();
  }, [user.uid]);
  
  const createChat = async (otherUserId) => {
    try {
      const chatRef = await addDoc(collection(db, 'chats'), {
        participants: [user.uid, otherUserId],
        createdAt: serverTimestamp()
      });
      console.log('Chat created with ID: ', chatRef.id);
      setChats(prevChats => [...prevChats, { id: chatRef.id, participants: [user.uid, otherUserId], createdAt: new Date() }]);
    } catch (error) {
      console.error('Error creating chat: ', error);
    }
  };

  return (
    <div>
      <h2>Chats</h2>
      {chats === null ? (
        <div>Loading chats...</div>
      ) : chats.length === 0 ? (
        <div>
          <h3>Suggested People to Chat With</h3>
          <ul>
            {suggestedUsers.map(suggestedUser => (
              <li key={suggestedUser.id}>
                {suggestedUser.name}
                <button onClick={() => createChat(suggestedUser.id)}>Chat</button>
              </li>
            ))}
          </ul>
          <Logout />
        </div>
      ) : (
        <div>
        <ul>
          {chats.map(chat => (
            <li key={chat.id} onClick={() => selectChat(chat.id)}>
              Chat with{' '}
              {chat.participants.map(participant => (
                participant !== user.uid && <UserNameFromUid key={participant} userId={participant} />
              ))}
            </li>
          ))}
        </ul>
        <Logout />
        </div>
      )}
    </div>
  );
};

export default ChatList;