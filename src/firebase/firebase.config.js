import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6fo8MHp8uSet5N6hvU69eto41D17lWGw",
  authDomain: "prn231-86d77.firebaseapp.com",
  projectId: "prn231-86d77",
  storageBucket: "prn231-86d77.appspot.com",
  messagingSenderId: "240476493815",
  appId: "1:240476493815:web:9c09e6322648c7bb7800f2"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
