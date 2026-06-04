import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAE9df4zoNC87N70DsP5KmZmvW46aSEqB0",
  authDomain: "toilet-checklist.firebaseapp.com",
  projectId: "toilet-checklist",
  storageBucket: "toilet-checklist.firebasestorage.app",
  messagingSenderId: "299583060764",
  appId: "1:299583060764:web:900f6c17a172e813e458d9",
  measurementId: "G-D61QE7ZDJC"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);