// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from '@firebase/firestore';
import { getStorage } from "firebase/storage";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyD6u3biUg7P3cdfcvpghI_SvD4zz03S1YA",
  authDomain: "invoice-generator-7b5ce.firebaseapp.com",
  projectId: "invoice-generator-7b5ce",
  storageBucket: "invoice-generator-7b5ce.appspot.com",
  messagingSenderId: "98178041358",
  appId: "1:98178041358:web:c6d85a6815db0e20891e5f",
  measurementId: "G-19BZH2M1B8"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);