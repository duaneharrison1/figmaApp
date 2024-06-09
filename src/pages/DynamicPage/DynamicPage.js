import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DynamicPage.css';
import firebase from '../../firebase';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PasswordTextField from '../../components/PasswordTextfield/PasswordTextfield.js';
import bcrypt from 'bcryptjs';
import ButtonColored from '../../components/ButtonColored/ButtonColored';

function DynamicPage({ url }) {
  const dbFirestore = firebase.firestore();
  const navigate = useNavigate();
  document.title = url.title;
  const [isMobile, setIsMobile] = useState(false);
  const [mobile, setMobile] = useState("");
  const [desktop, setDesktop] = useState("");
  const [faviconUrl, setFaviconUrl] = useState('');
  const [activeSubscriber, setActiveSubscriber] = useState("true");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const isOpenInMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [password, setPassword] = useState('');

  const navigateToHome = () => {
    navigate("/");
  };

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    if (activeSubscriber === "true") {
      if (faviconUrl) {
        link.href = faviconUrl;
      } else {
        link.remove();
      }
    } else {
      link.href = "https://firebasestorage.googleapis.com/v0/b/figmawebapp.appspot.com/o/figmafolio-favicon.png?alt=media&token=3b9cc2d9-01c6-470e-910a-a64c168ed870?v=2";
    }
  }, [activeSubscriber, faviconUrl]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    dbFirestore.collection('user').doc(url.userId).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
      if (snapshot.size === 0) {
        setActiveSubscriber("false");
      } else {
        snapshot.forEach(subscription => {
          if (subscription.data().status === "active" || subscription.data().status === "trialing") {
            setActiveSubscriber("true");
          } else {
            setActiveSubscriber("false");
          }
        });
      }
    });

    if (activeSubscriber === "true") {
      if (url.faviconUrl) {
        setFaviconUrl(url.faviconUrl);
      } else {
        setFaviconUrl('');
      }
    }

    if (url.urls.figmaMobileUrl === "") {
      setMobile(url.urls.figmaDesktopUrl);
    } else {
      setMobile(url.urls.figmaMobileUrl);
    }

    if (url.urls.figmaDesktopUrl === "") {
      setDesktop(url.urls.figmaMobileUrl);
    } else {
      setDesktop(url.urls.figmaDesktopUrl);
    }

    if (isOpenInMobile) {
      setIsMobile(true);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [dbFirestore, url, isOpenInMobile, activeSubscriber]);

  const handlePassword = (password) => {
    setPassword(password);
  };

  const checkPassword = () => {
    setIsPasswordCorrect(bcrypt.compareSync(password, url.encryptedPassword));

    if(!isPasswordCorrect){
      alert("You have entered a wrong password")
    }
  };

  return (
    <>
      {url.isPasswordActive == true ?
        <>
          {!isPasswordCorrect ? (
            <Modal.Dialog className='folio-password-modal'>
              <div className='password-modal-content'>
                <Modal.Title className='password-modal-title'>Login to {url.title}</Modal.Title>
                <PasswordTextField
                  formLabel="Password"
                  errorMsg="Wrong password"
                  className='password-input'
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  onChange={handlePassword} />
                <ButtonColored className="login-folio-btn" label={"Login"} onClick={checkPassword} />
              </div>
            </Modal.Dialog>
          ) : (
            <>
              {activeSubscriber === "true" ? (<div></div>) : (
                <div className="text-overlay" onClick={navigateToHome}>
                  <p className='made-with'>Made with <span className="made-with-figmaolio">Figmafolio</span></p>
                </div>
              )}
              <iframe
                src={isMobile ? mobile : desktop}
                allowFullScreen
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100vh' }}
                className='dynamicpage_view_figma_view'>
              </iframe>
            </>
          )}

        </> :

        <>
          {activeSubscriber === "true" ? (<div></div>) : (
            <div className="text-overlay" onClick={navigateToHome}>
              <p className='made-with'>Made with <span className="made-with-figmaolio">Figmafolio</span></p>
            </div>
          )}
          <iframe
            src={isMobile ? mobile : desktop}
            allowFullScreen
            referrerPolicy="no-referrer"
            style={{ width: '100%', height: '100vh' }}
            className='dynamicpage_view_figma_view'>
          </iframe>
        </>
      }

    </>
  );
}

export default DynamicPage;
