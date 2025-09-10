// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

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
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
// connectFunctionsEmulator(functions, "localhost", 5001);
const db = getFirestore(app);
const auth = getAuth(app);
// const analytics = getAnalytics(app);

if (window.location.hostname === "localhost") {
  console.log("Ambiente de desenvolvimento detectado. Conectando aos emuladores...");

  // Conecta ao emulador de Autenticação
  // A porta padrão é 9099
  connectAuthEmulator(auth, "http://localhost:9099");

  // Conecta ao emulador de Funções
  // A porta padrão é 5001
  connectFunctionsEmulator(functions, "localhost", 5001);
}

export {app, functions, db, auth};