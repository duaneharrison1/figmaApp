import { initializeApp } from "firebase/app"
import { useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore"
import { getAuth, getAdditionalUserInfoetAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDerK_WLES9rmbeW0y-nnhYr6IycedWvCk",
  authDomain: "figmawebapp.firebaseapp.com",
  projectId: "figmawebapp",
  storageBucket: "figmawebapp.appspot.com",
  messagingSenderId: "570481581357",
  appId: "1:570481581357:web:720bb78fa235645658c7a4",
  measurementId: "G-WY4SYMF6SF"
}
export async function upload(file, currentUser) {
  const fileRef = ref(storage, currentUser.uid + '.png');



  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);

  updateProfile(currentUser, { photoURL });

  alert("Uploaded file!");
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user));
    return unsub;
  }, [])

  return currentUser;
}

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app);
export const db = getFirestore(app)
export const storage = getStorage(app);