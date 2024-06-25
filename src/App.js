import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore'
import Login from './components/Login';
import NavBar from './components/NavBar'
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindows';
import SetProfile from './components/SetProfile';


const App = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const selectChat = (chatId) => {
    setSelectedChat(chatId);
  };

  useEffect(() => {
    // Setting up the listener for auth state changes and checks if the user's profile is complete
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data().displayName !== "Anonymous" && userSnap.data().handle) {
          setProfileComplete(true);
        } else {
          setProfileComplete(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    // Cleanup function to remove the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div>
      {!isLoggedIn ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : profileComplete ?
      (
        <div id='chat-container'>
          <ChatList selectChat={selectChat} />
          {selectedChat && <ChatWindow selectedChat={selectedChat} />}
        </div>
      ) : (
        <SetProfile onProfileSet={() => setProfileComplete(true)} />
      )
    }
    </div>
  );
};

export default App;
