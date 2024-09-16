import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyB4jDtie9KKGZ7XzOfAdfoxWMH4-3Fimbk",
  authDomain: "astro-app1.firebaseapp.com",
  databaseURL:
    "https://astro-app1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "astro-app1",
  storageBucket: "astro-app1.appspot.com",
  messagingSenderId: "189041618462",
  appId: "1:189041618462:web:4ad050e79f38e7e07bc80f",
  measurementId: "G-M1QF8HEYNS",
};

// Initialize Firebase
let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;
export const auth = getAuth(firebase_app);
export const db = getFirestore(firebase_app);
export const database = getDatabase(firebase_app);

