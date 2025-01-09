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
        const storage = getStorage();

        // Fetch the main HTML file (index.html or about.html)
        const fileRef = ref(storage, "testingHtml/index.html");
        const fileUrl = await getDownloadURL(fileRef);

        const response = await fetch(fileUrl);
        let html = await response.text();

        // Replace relative paths for styles and images with Firebase Storage URLs
        html = await replaceRelativePaths(html, storage);

        setHtmlContent(html);
      } catch (error) {
        console.error("Error fetching HTML file:", error);
      }
    };

    const replaceRelativePaths = async (html, storage) => {
      const replacements = {
        "styles.css": "testingHtml/styles.css",
        "imageOne.jpg": "testingHtml/imageOne.jpg",
      };

      for (const [relativePath, storagePath] of Object.entries(replacements)) {
        const fileRef = ref(storage, storagePath);
        const fileUrl = await getDownloadURL(fileRef);
        html = html.replace(new RegExp(relativePath, "g"), fileUrl);
      }

      return html;
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
