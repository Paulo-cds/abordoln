// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
  // apiKey: 'AIzaSyAqPI_HwYj2T6c8EYz8bePKIamTw39oGzo',
  // authDomain: 'a-bordo-ln.firebaseapp.com',
  // projectId: 'a-bordo-ln',
  // storageBucket: 'a-bordo-ln.firebasestorage.app',
  // messagingSenderId: '422851814237',
  // appId: '1:422851814237:web:48f25fc1a0743c284c3eb4',
  // measurementId: 'G-PGMBVSE4XP',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);