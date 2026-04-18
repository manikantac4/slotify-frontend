import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCa2H4ubCOEaCKi5DzcP_m2DRURWRG-8rw",
  authDomain: "slotify-59fe3.firebaseapp.com",
  projectId: "slotify-59fe3",
  storageBucket: "slotify-59fe3.firebasestorage.app",
  messagingSenderId: "1041282341306",
  appId: "1:1041282341306:web:58d8efd7ce0841bfe4e583"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);