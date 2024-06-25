import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const SetProfile = ({ onProfileSet }) => {
  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const user = auth.currentUser;
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('User not logged in');
      return;
    }

    if (!handle || !displayName) {
      setError('Handle and display name are required');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        handle: handle.startsWith('@') ? handle : `@${handle}`,
        displayName
      });
      onProfileSet();
    } catch (error) {
      setError('Error updating profile: ' + error.message);
    }
  };

  const handleHandleChange = (e) => {
    let inputHandle = e.target.value;
    // Ensure "@" is always at the beginning
    if (!inputHandle.startsWith('@')) {
      inputHandle = '@' + inputHandle;
    }
    setHandle(inputHandle);
  };

  return (
    <div>
      <h2>Set Your Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Handle:
            <input
              type="text"
              value={handle}
              onChange={handleHandleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Display Name:
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default SetProfile;
