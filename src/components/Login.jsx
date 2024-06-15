import React, { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const auth = getAuth();

  useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        onLoginSuccess();
      }
    });
    return () => unregisterAuthObserver();
  }, [onLoginSuccess]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLoginSuccess();
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleSignIn = async (provider) => {
    try {
      await signInWithPopup(getAuth(), provider);
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
