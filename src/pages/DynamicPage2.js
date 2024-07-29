import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import firebase from '../firebase';
import Modal from 'react-bootstrap/Modal';
import bcrypt from 'bcryptjs';
import PasswordTextField from '../components/PasswordTextfield/PasswordTextfield';
import ButtonColored from '../components/ButtonColored/ButtonColored';
function DynamicPage2() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobile, setMobile] = useState("");
  const [desktop, setDesktop] = useState("");
  const [isPasswordActive, setIsPasswordActive] = useState("");
  const [urlData, setUrlData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [isError, setIsError] = useState(null);
  const [encryptedPassword, setEncryptedPassword] = useState(null);
  const [title, setTitle] = useState(null);
  const [password, setPassword] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  const dbFirestore = firebase.firestore();
  const isOpenInMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (faviconUrl) {
      link.href = faviconUrl;
    } else {
      link.href = '';
    }
  }, [faviconUrl]);

  useEffect(() => {
    var domain = window.location.host
    if (domain == 'www.figmafolio.com' || domain == 'figma-app-tau.vercel.app' || domain == 'localhost:3000') {
    } else {
      const fetchData = async () => {
        console.log("start fetch");
        try {
          var domain = window.location.host
          const modifiedDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
          dbFirestore.collectionGroup('url').where('customDomain', '==', modifiedDomain).get().then(snapshot => {
            if (snapshot.docs.length === 0) {
              dbFirestore.collectionGroup('url').where('customDomain', '==', domain).get().then(snapshot => {
                const fetchedData = snapshot.docs.map(doc => doc.data());
                fetchedData.forEach((value) => {
                  dbFirestore.collection('user').doc(value.userId).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
                    if (snapshot.size === 0) {

                    } else {

                      snapshot.forEach(subscription => {
                        if (subscription.data().status === "active" || subscription.data().status == "trialing") {
                          if (value.isDraft == "false") {
                            document.title = value.title;
                            setFaviconUrl(value.faviconUrl)
                            setEncryptedPassword(value.encryptedPassword)
                            setIsPasswordActive(value.isPasswordActive)
                            setDesktop(value.urls.figmaDesktopUrl)
                            setMobile(value.urls.figmaMobileUrl)

                            if (value.urls.figmaDesktopUrl == "") {
                              setDesktop(value.urls.figmaMobileUrl)
                            }

                            if (value.urls.figmaMobileUrl == "") {
                              setMobile(value.urls.figmaDesktopUrl)
                            }
                          }
                        }
                      }
                      )
                    }
                  })
                });
              })
            } else {

              const fetchedData = snapshot.docs.map(doc => doc.data());
              fetchedData.forEach((value) => {
                dbFirestore.collection('user').doc(value.userId).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
                  if (snapshot.size === 0) {

                  } else {

                    snapshot.forEach(subscription => {
                      if (subscription.data().status === "active" || subscription.data().status == "trialing") {

                        if (value.isDraft == "false") {
                          document.title = value.title;
                          setEncryptedPassword(value.encryptedPassword)
                          setIsPasswordActive(value.isPasswordActive)
                          setFaviconUrl(value.faviconUrl)
                          setDesktop(value.urls.figmaDesktopUrl)
                          setMobile(value.urls.figmaMobileUrl)

                          if (value.urls.figmaDesktopUrl === "") {
                            setDesktop(value.urls.figmaMobileUrl)
                          }

                          if (value.urls.figmaMobileUrl === "") {
                            setMobile(value.urls.figmaDesktopUrl)
                          }
                        }
                      }
                    }
                    )
                  }
                })
              });
            }
          })
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
        console.log("finish");
      };
      fetchData();
    }
  }, [faviconUrl]
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    if (isOpenInMobile) {
      setIsMobile(true);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpenInMobile]);

  const checkPassword = () => {
    setIsPasswordCorrect(bcrypt.compareSync(password, encryptedPassword));
    if (!isPasswordCorrect) {
      setIsError(true)
    }
  };

  const handlePassword = (password) => {
    setPassword(password);
  };

  return (
    <>
      {isPasswordActive == true ?
        <>
          {!isPasswordCorrect ? (
            <Modal.Dialog className='folio-password-modal'>
              <div className='password-modal-content'>
                <Modal.Title className='password-modal-title'>Login to view {title}</Modal.Title>
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
                {isError == true && < p className='error-message'>You have entered a wrong password</p>}
              </div>
            </Modal.Dialog>
          ) : (
            <>
              <iframe
                src={isMobile ? mobile : desktop}
                allowFullScreen
                referrerPolicy="no-referrer"
                style={{ width: '100%', height: '100vh' }}
                className='dynamicpage_view_figma_view'>
              </iframe>

            </>)}
        </> : <>
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

export default DynamicPage2;
