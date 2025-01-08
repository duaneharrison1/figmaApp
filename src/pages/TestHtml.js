import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import firebase from '../firebase';
import Modal from 'react-bootstrap/Modal';
import bcrypt from 'bcryptjs';
import PasswordTextField from '../components/PasswordTextfield/PasswordTextfield';
import ButtonColored from '../components/ButtonColored/ButtonColored';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

function TestHtml() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  const [urlData, setUrlData] = useState({ desktop: '', mobile: '', isPasswordActive: false, encryptedPassword: '', title: '', faviconUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const dbFirestore = firebase.firestore();



  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const fetchHtml = async () => {
      try {
        // Initialize Firebase Storage
        const storage = getStorage();
        const fileRef = ref(storage, "https://firebasestorage.googleapis.com/v0/b/figmawebapp.appspot.com/o/testingfile.html?alt=media&token=694b6c0c-e1a9-4e5e-9773-7ac4ea80c759");

        // Get the download URL
        const fileUrl = await getDownloadURL(fileRef);

        // Fetch the file content
        const response = await fetch(fileUrl);
        const html = await response.text();

        // Set the HTML content
        setHtmlContent(html);
      } catch (error) {
        console.error("Error fetching HTML file:", error);
      }
    };

    fetchHtml();
  }, []);


  return (
<div>
      {/* Render the HTML content dynamically */}
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}

export default TestHtml;
