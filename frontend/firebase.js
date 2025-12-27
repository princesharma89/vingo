// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "vingo-food-delivery-f1b2a.firebaseapp.com",
  projectId: "vingo-food-delivery-f1b2a",
  storageBucket: "vingo-food-delivery-f1b2a.firebasestorage.app",
  messagingSenderId: "574712350804",
  appId: "1:574712350804:web:5facabde628aa32a7285c1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth(app);
export {app, auth};