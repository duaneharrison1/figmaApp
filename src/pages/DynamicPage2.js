import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import firebase from '../firebase';
import Modal from 'react-bootstrap/Modal';
import bcrypt from 'bcryptjs';
import PasswordTextField from '../components/PasswordTextfield/PasswordTextfield';
import ButtonColored from '../components/ButtonColored/ButtonColored';

function DynamicPage2() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  const [urlData, setUrlData] = useState({ desktop: '', mobile: '', isPasswordActive: false, encryptedPassword: '', title: '', faviconUrl: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const dbFirestore = firebase.firestore();

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
    link.href = urlData.faviconUrl || '';

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [urlData.faviconUrl]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("test test")
      try {
        const domain = window.location.host.replace(/^(https?:\/\/)?(www\.)?/, '');
        const snapshot = await dbFirestore.collectionGroup('url').where('customDomain', '==', domain).get();
        console.log("domain" + domain)
        if (!snapshot.empty) {
          const fetchedData = snapshot.docs[0].data();

          dbFirestore.collection('user').doc(fetchedData.userId).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
            snapshot.forEach(subscription => {
              if (subscription.data().status === "active" || subscription.data().status === "trialing") {
                setUrlData({
                  desktop: fetchedData.urls.figmaDesktopUrl || fetchedData.urls.figmaMobileUrl,
                  mobile: fetchedData.urls.figmaMobileUrl || fetchedData.urls.figmaDesktopUrl,
                  isPasswordActive: fetchedData.isPasswordActive,
                  encryptedPassword: fetchedData.encryptedPassword,
                  title: fetchedData.title,
                  faviconUrl: fetchedData.faviconUrl
                });
              }
            });
          });
        }
      } catch (error) {
        setError(error);
        console.log("no domain")
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkPassword = () => {
    setIsPasswordCorrect(bcrypt.compareSync(password, urlData.encryptedPassword));
    if (!isPasswordCorrect) {
      setIsError(true)
    }
  };

  const handlePasswordChange = (password) => {
    setPassword(password);
  };

  return (
    <>
      {urlData.isPasswordActive ? (
        !isPasswordCorrect ? (
          <Modal.Dialog className='folio-password-modal'>
            <div className='password-modal-content'>
              <Modal.Title className='password-modal-title'>Login to view {urlData.title}</Modal.Title>
              <PasswordTextField
                formLabel="Password"
                errorMsg="Wrong password"
                className='password-input'
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                onChange={handlePasswordChange}
              />
              <ButtonColored className="login-folio-btn" label={"Login"} onClick={checkPassword} />
              {isError && <p className='error-message'>You have entered a wrong password</p>}
            </div>
          </Modal.Dialog>
        ) : (
          <iframe
            src={isMobile ? urlData.mobile : urlData.desktop}
            allowFullScreen
            referrerPolicy="no-referrer"
            style={{ width: '100%', height: '100vh' }}
            className='dynamicpage_view_figma_view'
          ></iframe>
        )
      ) : (
        <iframe
          src={isMobile ? urlData.mobile : urlData.desktop}
          allowFullScreen
          referrerPolicy="no-referrer"
          style={{ width: '100%', height: '100vh' }}
          className='dynamicpage_view_figma_view'
        ></iframe>
      )}
    </>
  );
}

export default DynamicPage2;
