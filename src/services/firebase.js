// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  getStorage,
  uploadBytes,
  ref as storageRef,
  getDownloadURL,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = "he";
const firestore = getFirestore(app);
const storage = getStorage(app);

const uploadFileAndGetUrl = async (file, path) => {
  const f = await uploadBytes(storageRef(storage, path), file);
  const url = await getDownloadURL(f.ref);

  return url;
};

export { auth, firestore, uploadFileAndGetUrl };
