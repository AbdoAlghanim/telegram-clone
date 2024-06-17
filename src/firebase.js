import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {

    apiKey: "AIzaSyBw0_zmkK1q5EPJDe_zdJ33lmxQ9AnJz9s",
  
    authDomain: "telegram-clone-8200c.firebaseapp.com",
  
    projectId: "telegram-clone-8200c",
  
    storageBucket: "telegram-clone-8200c.appspot.com",
  
    messagingSenderId: "130280216226",
  
    appId: "1:130280216226:web:89392a5a580a3bc8a229fb",
  
    measurementId: "G-M2JYB94YPY"
  
  };
  

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db};
