import { initializeApp } from "firebase/app"
import { useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore"
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { getAuth, getAdditionalUserInfoetAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBhMB0QZh3UK9rmf9e67K_AHXrrKmN9sqY",
  authDomain: "figmafolio-testing.firebaseapp.com",
  projectId: "figmafolio-testing",
  storageBucket: "figmafolio-testing.appspot.com",
  messagingSenderId: "880532212371",
  appId: "1:880532212371:web:474131e4ef06bf447a1b66",
  measurementId: "G-KB7ZML7XQG"
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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}
export default firebase