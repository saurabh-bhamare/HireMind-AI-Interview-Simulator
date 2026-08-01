import { initializeApp } from "firebase/app";

import {
  getAuth,
  GoogleAuthProvider
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewiq-6bcfd.firebaseapp.com",
  projectId: "interviewiq-6bcfd",
  storageBucket: "interviewiq-6bcfd.firebasestorage.app",
  messagingSenderId: "993140133187",
  appId: "1:993140133187:web:da1ebf5d02cfc46cc4b3f6",
  measurementId: "G-KGDZ90GZV8"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };