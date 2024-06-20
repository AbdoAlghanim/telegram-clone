import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

const SendMessage = ({ selectedChat }) => {
  const [message, setMessage] = useState('');
  const currentUser = auth.currentUser;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    try {
      await addDoc(collection(db, 'chats', selectedChat, 'messages'), {
        text: trimmedMessage,
        senderId: currentUser.uid,
        senderName: currentUser.displayName || 'Anonymous',
        timestamp: serverTimestamp(),
      });
      setMessage(''); // Clear the input field after sending the message
    } catch (error) {
      console.error('Error sending message: ', error);
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessage;
