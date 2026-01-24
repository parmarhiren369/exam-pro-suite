import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAIafE0DpoJgDl_k7vXYJsz1Lh1IqfF_nw",
  authDomain: "hiren-s-evalutor.firebaseapp.com",
  projectId: "hiren-s-evalutor",
  storageBucket: "hiren-s-evalutor.firebasestorage.app",
  messagingSenderId: "388285857577",
  appId: "1:388285857577:web:57e7d12e856857cd9f0138",
  measurementId: "G-RYGVQKWZD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
