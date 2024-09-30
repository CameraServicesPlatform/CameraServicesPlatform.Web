import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2cV2sxqM4INpHxDLdNnDVTAnIupgJTTU",
  authDomain: "cameraserviceplatform.firebaseapp.com",
  projectId: "cameraserviceplatform",
  storageBucket: "cameraserviceplatform.appspot.com",
  messagingSenderId: "900743389934",
  appId: "1:900743389934:web:82255c21172a2299ee09ff",
  measurementId: "G-K05RNCRSXB",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
