import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDerK_WLES9rmbeW0y-nnhYr6IycedWvCk",
  authDomain: "figmawebapp.firebaseapp.com",
  projectId: "figmawebapp",
  storageBucket: "figmawebapp.appspot.com",
  messagingSenderId: "570481581357",
  appId: "1:570481581357:web:720bb78fa235645658c7a4",
  measurementId: "G-WY4SYMF6SF"
}

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app);