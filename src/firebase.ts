import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_riOG4DUyDaFf2XlOAdT24FXJg-FqTcI",
  authDomain: "e-pilot-b235d.firebaseapp.com",
  databaseURL:
    "https://e-pilot-b235d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "e-pilot-b235d",
  storageBucket: "e-pilot-b235d.firebasestorage.app",
  messagingSenderId: "1046795180441",
  appId: "1:1046795180441:web:eac70ccb9b6bfd1d271b08",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
