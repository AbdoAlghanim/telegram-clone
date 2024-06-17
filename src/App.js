import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import NavBar from './components/NavBar'

function App() {
  const [user, setUser] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);
  const handleLoginSuccess = () => {
    setUser(auth.currentUser);
  };
  return (
	  <div>
    <NavBar/>
    {/* TODO: Implement conditional rendering of the Chat component and the Login page */}
     {/* !user ? <Login onLoginSuccess={handleLoginSuccess}/> : <Chat></Chat> */}
     <Login onLoginSuccess={handleLoginSuccess}/>
    </div>
  );
}

export default App;
