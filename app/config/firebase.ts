import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD335oKZ6JC9lVGTl7DFX-3dV7Y73ji1NE",
  authDomain: "kurtadv-8f862.firebaseapp.com",
  projectId: "kurtadv-8f862",
  storageBucket: "kurtadv-8f862.appspot.com",
  messagingSenderId: "291974737791",
  appId: "1:291974737791:web:6e125de7a5678b19e0744a",
  measurementId: "G-H4EL7ZM0K3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);