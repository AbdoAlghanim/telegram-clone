import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const auth = getAuth();
  const db = getFirestore()
  // update the auth instance when the user logs in/out (used for conditional rendering in App.js)
  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, (user) => {
      if (user) {
        onLoginSuccess();
      }
    });
    return () => unregisterAuthObserver();
  }, [onLoginSuccess]);

  // function to be called in email sign in/up 
  const addUserToDb = async (result) => {
    const user = result.user;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName || 'Anonymous',
      email: user.email,
      photoURL: user.photoURL || '',
      createdAt: new Date()
    }, { merge: true }); // merge: true ensures no overwrites occur
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      
      await addUserToDb(result);
      onLoginSuccess();
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleSignIn = async (provider) => {
    try {
      const result = await signInWithPopup(getAuth(), provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date()
      }, { merge: true }); // merge: true to avoid overwriting existing fields

      onLoginSuccess();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };
 

  
  return (
    <div>
      <h2>{isSignUp ? 'Sign Up with Email and Password' : 'Login with Email and Password'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
      </form>
      <p>
        {!isSignUp ? 'Don\'t Have an account?' : 'Already Have an account?'}
      </p>
      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
      </button>
      <hr />
      <h2>Or Login with your favorite services!</h2>
      <button onClick={() => handleSignIn(new GoogleAuthProvider())}>Sign in with Google</button>
    </div>
  );
};

export default Login;
