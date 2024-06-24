import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, getDocs, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import Logout from './LogOut';

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
  // TODO: implement a mechanism to get the user's name from user id
  // the commented mechanism returns a promise which react can't handle as a child
/*
  const getUserNameById = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const name = await userSnap.data().displayName || 'Unknown User';
        return name;
      } else {
        console.log('No such user!');
        return 'Unknown User';
      }
    } catch (error) {
      console.error('Error getting user name: ', error);
      return 'Unknown User';
    }
  };
  
  const fetchUserNameById = async (getUserNameById) => {
    const displayName = await getUserNameById;
    return displayName
  }
  chats.map(chat => console.log(fetchUserNameById(getUserNameById(chat.participants.filter((x) => x != user.uid)[0]))))
   */
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
              {chat.name || `Chat with ${chat.participants.filter(id => id !== user.uid)[0]}`}
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