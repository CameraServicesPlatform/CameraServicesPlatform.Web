// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// just change config below to start
const firebaseConfig = {
  apiKey: " ",
  authDomain: "",
  projectId: " ",
  storageBucket: " ",
  messagingSenderId: " ",
  appId: " ",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
