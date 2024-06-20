import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import NavBar from './components/NavBar'
import ChatList from './components/ChatList';
import { auth } from './firebase';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const selectChat = (chatId) => {
    setSelectedChat(chatId);
  };

  useEffect(() => {
    // Setting up the listener for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    // Cleanup function to remove the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
	  <div>
    <NavBar/>

      { /* TODO: Implement conditional rendering of the Chat component and the Login page */}
      { /* !user ? <Login onLoginSuccess={handleLoginSuccess}/> : <Chat></Chat> */}
    {!user ? (
        <Login onLoginSuccess={handleLoginSuccess}/>
        ) : (
          <ChatList selectChat={selectChat}/>
        )}
     
    </div>
  );
}

export default App;
