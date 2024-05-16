// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBR3KA3CFXO_6-LV8PT68SZb4lAW_qwEWU",
    authDomain: "davidyelinsharedcollections.firebaseapp.com",
    projectId: "davidyelinsharedcollections",
    storageBucket: "davidyelinsharedcollections.appspot.com",
    messagingSenderId: "204581258224",
    appId: "1:204581258224:web:d82128fecbbc72d3861335",
    measurementId: "G-Q17F1H5RRJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export {
    auth,
    firestore
}