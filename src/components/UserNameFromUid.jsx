import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

const UserNameFromUid = ({ userId }) => {
  const [userName, setUserName] = useState('Loading...');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserName(userSnap.data().displayName || 'Unknown User');
        } else {
          setUserName('Unknown User');
        }
      } catch (error) {
        console.error('Error getting user name: ', error);
        setUserName('Unknown User');
      }
    };

    fetchUserName();
  }, [userId]);

  return <span>{userName}</span>;
};

export default UserNameFromUid;
