// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from '@firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyDZUPaAYRQj1WfctgQmPh0dw9Geds6lGiY",
  authDomain: "invoice-generator-f622b.firebaseapp.com",
  projectId: "invoice-generator-f622b",
  storageBucket: "invoice-generator-f622b.appspot.com",
  messagingSenderId: "560076647222",
  appId: "1:560076647222:web:1019d278ede7f4028fe197",
  measurementId: "G-DTTQ5SLLQE"
  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);