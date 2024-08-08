// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPHbWJQXE3tdb82bQaOWppYT8Gdja5f4o",
  authDomain: "inventory-management-d9018.firebaseapp.com",
  projectId: "inventory-management-d9018",
  storageBucket: "inventory-management-d9018.appspot.com",
  messagingSenderId: "56817249133",
  appId: "1:56817249133:web:c6205e660f7c1b02d4c864",
  measurementId: "G-H7B0YM31DJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}