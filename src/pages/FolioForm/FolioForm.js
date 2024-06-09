import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/NavBar/Navbar';
import { auth, uploadFaviconUrl } from '../../firebase';
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from 'react-router-dom';
import { t } from 'i18next';
import i18n from '../../i18n';
import './FolioForm.css'
import FormTitle from '../../components/FormTitle/FormTitle';
import FormInstruction from '../../components/FormInstruction/FormInstruction';
import FormContent from '../../components/FormContent/FormContent';
import FormCustomDomain from '../../components/FormCustomDomain/FormCustomDomain';
import FormFavicon from '../../components/FormFavicon/FormFavicon';
import firebase from '../../firebase';
import axios from "axios";
import AlertErrorModal from '../../components/AlertErrorModal/AlertErrorModal';
import MobileNavBar from '../MobileForm/MobileNavBar/MobileNavbar';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import FormPassword from '../../components/FormPassword/FormPassword';
import bcrypt from 'bcryptjs';
const isOpenInMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
export default function FolioForm() {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const currentLanguage = i18n.language;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tab1');
  const dbFirestore = firebase.firestore();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState(location.state.subscriptionType);
  const [trialConsume, setTrialConsume] = useState(location.state.trialConsume);
  const user = auth.currentUser;
  const handleDataFromChild = (data) => {
    setPassword(data);
  };

  const handlePasswordStatusFromChild = (data) => {
    setIsPasswordActive(data);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (fromPreview === "true") {
      setActiveTab('tab2');
    }
  }, []);

  const [fromPreview, setFromPreview] = useState(
    location && location.state && location.state.object && location.state.object.fromPreview
      ? location.state.object.fromPreview
      : ""
  );

  const [faviconFromLocal, setFaviconFromLocal] = useState(null);


  const [oldDomain, setOldDomain] = useState(
    location && location.state && location.state.object && location.state.object.customDomain
      ? location.state.object.customDomain
      : ""
  );

  const [docId, setDocId] = useState(
    location && location.state && location.state.object
      ? location.state.object.id
      : ""
  );

  const [title, setTitle] = useState(
    location && location.state && location.state.object && location.state.object.title
      ? location.state.object.title
      : ""
  );
  const [generatedUrl, setGeneratedUrl] = useState(
    location && location.state && location.state.object && location.state.object.generatedUrl
      ? location.state.object.generatedUrl
      : ""
  );
  const [faviconImage, setFaviconImage] = useState(
    location && location.state && location.state.object && location.state.object.faviconUrl
      ? location.state.object.faviconUrl
      : ""
  );

  const [figmaDesktopUrl, setFigmaDesktopUrl] = useState(
    location.state && location.state.object && location.state.object.urls && location.state.object.urls.figmaDesktopUrl
      ? location.state.object.urls.figmaDesktopUrl
      : ""
  );
  const [figmaMobileUrl, setFigmaMobileUrl] = useState(
    location.state && location.state.object && location.state.object.urls && location.state.object.urls.figmaMobileUrl
      ? location.state.object.urls.figmaMobileUrl
      : ""
  );

  const [domain, setDomain] = useState(
    location && location.state && location.state.object && location.state.object.customDomain
      ? location.state.object.customDomain
      : ""
  );
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };
  const [randomurl, setRandomUrl] = useState('');

  const [password, setPassword]  = useState(
    location && location.state && location.state.object && location.state.object.password
      ? location.state.object.password
      : ""
  );
  const [isPasswordActive, setIsPasswordActive]  = useState(
    location && location.state && location.state.object && location.state.object.isPasswordActive
      ? location.state.object.isPasswordActive
      : false
  );
  

  const [encryptedPassword, setEncryptedPassword]  = useState(
    location && location.state && location.state.object && location.state.object.password
      ? location.state.object.encryptedPassword
      : ""
  );

  
  var newCustomDomainData = {
    "name": domain
  };
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 83YzDqNvO4OoVtKXQXJ4mTyj'
  };
  const goToPreview = async () => {
    if ((!figmaDesktopUrl.includes('figma.com/file') && !figmaMobileUrl.includes('figma.com/file')) &&
      (figmaMobileUrl.includes('figma.com/proto') || figmaMobileUrl.includes('figma.com/embed') ||
        figmaDesktopUrl.includes('figma.com/proto') || figmaDesktopUrl.includes('figma.com/embed'))) {
      navigate("/" + currentLanguage + '/preview', {
        state: {
          object: {
            id: docId,
            title: title,
            generatedUrl: generatedUrl,
            faviconUrl: faviconImage,
            customDomain: domain,
            password: password,
            isPasswordActive: isPasswordActive,
            urls: {
              figmaDesktopUrl: figmaDesktopUrl,
              figmaMobileUrl: figmaMobileUrl
            }
          },
          subscriptionType: subscriptionType
        }
      });
    } else {
      setShowErrorModal(true);
    }
  }

  //GENERATE URL

  function generateRandomString(length) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }

  useEffect(() => {
    setRandomUrl(generateRandomString(10))
    if (password == ""){
      setPassword(generateRandomString(6))
    }
  
    const fetchData = async () => {
      try {
        dbFirestore.collectionGroup('url').where('generatedUrl', '==', randomurl).get().then(snapshot => {
          if (snapshot.docs.length !== 0) {
            setRandomUrl(generateRandomString(10))
            console.log("secondRandomUrl " + randomurl)
          }
        })
      } catch (error) {
        console.error("error" + error);
      }
    };
    fetchData();
  }, []);

  function removeWordFromString(inputString, wordToRemove) {
    const regex = new RegExp(`\\b${wordToRemove}\\b`, 'gi');
    const resultString = inputString.replace(regex, '');
    return resultString;
  }

  function editUrl(url) {
    const originalString = url;
    const wordToRemove = "https://";
    const hideUi = "&hide-ui=1"
    const hotspot = "&hotspot-hints=0"
    const embedHost = "www.figma.com/embed?embed_host=share&url=https%3A%2F%2F"
    var newUrl = ""
    var modifiedUrl = ""
    const modifiedString = removeWordFromString(originalString, wordToRemove);
    if (url !== '') {
      if (!modifiedString.includes(embedHost)) {
        newUrl = "https://" + embedHost + modifiedString
      } else {
        newUrl = url;
      }
      if (!newUrl.includes(hideUi)) {
        newUrl += hideUi
      }
      if (!newUrl.includes(hotspot)) {
        newUrl += hotspot
      }
      if (newUrl.includes("scaling=contain")) {
        modifiedUrl = newUrl.replace(new RegExp("scaling=contain", 'g'), "scaling=scale-down-width");
        newUrl = modifiedUrl
      } else if (newUrl.includes("scaling=min-zoom")) {
        modifiedUrl = newUrl.replace(new RegExp("scaling=min-zoom", 'g'), "scaling=scale-down-width");
        newUrl = modifiedUrl
      } else if (newUrl.includes("scaling=scale-down")) {
        if (!newUrl.includes("scaling=scale-down-width")) {
          modifiedUrl = newUrl.replace(new RegExp("scaling=scale-down", 'g'), "scaling=scale-down-width");
          newUrl = modifiedUrl
        }
      }
    } else {
      newUrl = ""
    }
    return newUrl
  }

  const handleTitle = (data) => {
    setTitle(data);
  };

  const handleFigmaMobileUrl = (data) => {
    setFigmaMobileUrl(data);
  }

  const handleFigmaDesktopUrl = (data) => {
    setFigmaDesktopUrl(data);
  }
  const handleDomain = (data) => {
    setDomain(data);
  }

  useEffect(() => {
    console.log("State after setFaviconFromLocal:", faviconFromLocal);
  }, [faviconFromLocal]);

  const handleFaviconImage = async (data) => {
    if (docId) {
      try {
        var faviconUrlFromFirebase = await uploadFaviconUrl(data, generatedUrl);
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").doc(docId).update({
          faviconUrl: faviconUrlFromFirebase,
          updatedAt: new Date()
        })
        alert("Success");
      } catch (error) {
        alert(error);
      }
    } else {
      try {
        var newFaviconImage = await uploadFaviconUrl(data, generatedUrl);
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").add({
          userId: user.uid,
          faviconUrl: newFaviconImage,
          isDraft: "false",
          generatedUrl: randomurl,
          createdAt: new Date(),
        })
        setGeneratedUrl(randomurl);
        setDocId(docRef.id);
        alert("Success");
      } catch (error) {
        alert(error);
      }
    }
  }

  const deleteDomainFromVercel = async () => {
    await axios.delete(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains/${oldDomain}?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
      {
        headers: headers,
      }).catch((error) => {
        console.log(error.response.data.error)
      });
  }
  const addDomainToVercel = async () => {
    await axios.post(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
      newCustomDomainData, {
      headers: headers,
    });
  }

  const saveDomain = async () => {
    if (docId) {
      if (oldDomain !== domain) {
        console.log("wentHere1")
      }
      try {
        await deleteDomainFromVercel();
        await addDomainToVercel();
        await dbFirestore.collection('user').doc(user.uid).collection("url").doc(docId).update({
          customDomain: domain,
          updatedAt: new Date()
        })
        alert("Success");
      } catch (error) {
        alert(error.response.data.error.code);
        return;
      }
    } else {
      console.log(domain)
      if (domain) {
        console.log(newCustomDomainData)
        try {
          await addDomainToVercel();
          const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").add({
            userId: user.uid,
            isDraft: "false",
            customDomain: domain,
            generatedUrl: randomurl,
            createdAt: new Date(),
          });
          setDocId(docRef.id);
          setGeneratedUrl(randomurl);
          alert("Success");
        } catch (error) {
          alert(error.response.data.error.code);
          return;
        }
      }
    }
    setOldDomain(domain)
  }

  const saveFigmaUrl = async () => {
    if ((!figmaDesktopUrl.includes('figma.com/file') && !figmaMobileUrl.includes('figma.com/file')) &&
      (figmaMobileUrl.includes('figma.com/proto') || figmaMobileUrl.includes('figma.com/embed') ||
        figmaDesktopUrl.includes('figma.com/proto') || figmaDesktopUrl.includes('figma.com/embed'))) {
      try {
        if (docId) {
          const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").doc(docId).update({
            urls: {
              figmaDesktopUrl: editUrl(figmaDesktopUrl),
              figmaMobileUrl: editUrl(figmaMobileUrl)
            },
            updatedAt: new Date()
          })
        } else {
          const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").add({
            userId: user.uid,
            generatedUrl: randomurl,
            isDraft: "false",
            urls: {
              figmaDesktopUrl: editUrl(figmaDesktopUrl),
              figmaMobileUrl: editUrl(figmaMobileUrl)
            },
            createdAt: new Date(),
          })
          setDocId(docRef.id);
          setGeneratedUrl(randomurl);
        }
      } catch (err) {
        alert(err.message)
      } finally {
        alert("Success")
      }
    } else {
      setShowErrorModal(true);
    }
  }

  const saveTitle = async () => {
    try {
      if (docId) {
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").doc(docId).update({
          title: title,
          updatedAt: new Date()
        })
      } else {
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").add({
          userId: user.uid,
          title: title,
          isDraft: "false",
          generatedUrl: randomurl,
          createdAt: new Date(),
        })
        setGeneratedUrl(randomurl);
        setDocId(docRef.id);
      }
    } catch (err) {
      alert(err.message)
    } finally {
      alert("Success")
    }
  }

  const handlePassword = async () => {

    if (password.length >= 6) {
      alert('Your password must be at least 6 characters long.');
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      try {
        if (docId) {
          const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").doc(docId).update({
            password: password,
            encryptedPassword: hashPassword,
            isPasswordActive: isPasswordActive,
            updatedAt: new Date()
          })
        } else {
          const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").add({
            userId: user.uid,
            password: password,
            encryptedPassword: hashPassword,
            isPasswordActive: isPasswordActive,
            generatedUrl: randomurl,
            createdAt: new Date(),
          })
          setGeneratedUrl(randomurl);
          setDocId(docRef.id);
        }
      } catch (err) {
        alert(err.message)
      } finally {
        alert("Success")
      }
    }    
  }

  const handlePasswordStatus = async () => {

  }


  // Function to handle tab click
  const handleTabClick = (tabId, event) => {
    event.preventDefault();
    setActiveTab(tabId);
  };

  const handleTabClickMobile = (tabId, event) => {
    event.preventDefault();
    console.log(tabId);
  
    const basePath = `/${currentLanguage}`;
    const commonState = {
      object: {
        id: docId,
        title: title,
        generatedUrl: generatedUrl,
        faviconUrl: faviconImage,
        customDomain: domain,
        password: password,
        isPasswordActive: isPasswordActive,
        urls: {
          figmaDesktopUrl: figmaDesktopUrl,
          figmaMobileUrl: figmaMobileUrl
        }
      },
      subscriptionType: subscriptionType,
      trialConsume: trialConsume
    };
  
    const tabPaths = {
      tab1: `${basePath}/mobile-form-title`,
      tab2: `${basePath}/mobile-form-content`,
      tab3: `${basePath}/mobile-form-domain`,
      tab4: `${basePath}/mobile-form-favicon`,
      tab5: `${basePath}/mobile-form-password`,
      tab6: `${basePath}/mobile-instruction`
    };
  
    const navigatePath = tabPaths[tabId];
    if (navigatePath) {
      navigate(navigatePath, { state: commonState });
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate(currentLanguage + "/");
    }).catch((error) => {
    });
  }
  const viewSite = () => {
    window.open(`https://figmafolio.com/${generatedUrl}`, "_blank");
}

  return (

    <>
      {
        isMobile ?
          <>
            <div className='app-wrapper-mobile'>
              <MobileNavBar title={title} isFromTab={"fromTab"} />
              <div className='tab-container-mobile'>
                <h1 className='mobile-form-title m-0'>{title}</h1>
                <ul className="nav flex-column nav-tabs vertical-tabs-mobile">
                  <li className="nav-item-mobile">
                    <a className={`folio-form ${activeTab === 'tab1' ? 'active' : ''}`}
                      onClick={(e) => handleTabClickMobile('tab1', e)}
                      href="#tab1">
                      General
                    </a>
                  </li>
                  <li className="nav-item-mobile">
                    <a className={`folio-form ${activeTab === 'tab2' ? 'active' : ''}`}
                      onClick={(e) => handleTabClickMobile('tab2', e)}
                      href="#tab2">
                      Figma Links
                    </a>
                  </li>
                  <li className="nav-item-mobile">
                    <a className={`folio-form ${activeTab === 'tab3' ? 'active' : ''}`}
                      onClick={(e) => handleTabClickMobile('tab3', e)}
                      href="#tab3">
                      Custom Domain
                    </a>
                  </li>
                  <li className="nav-item-mobile">
                    <a className={`folio-form ${activeTab === 'tab4' ? 'active' : ''}`}
                      onClick={(e) => handleTabClickMobile('tab4', e)}
                      href="#tab4">
                      Favicon
                    </a>
                  </li>
                  <li className="nav-item-mobile">
                    <a className={`folio-form ${activeTab === 'tab5' ? 'active' : ''}`}
                      onClick={(e) => handleTabClickMobile('tab5', e)}
                      href="#tab5">
                      Password
                    </a>
                  </li>
                  <li className="nav-item-mobile-last">
                    <a className={`folio-form ${activeTab === 'tab6' ? 'active' : ''}`}
                      onClick={(e) => handleTabClickMobile('tab6', e)}
                      href="#tab6">
                      Need help?
                    </a>
                  </li>
                </ul>
                {generatedUrl.trim() !== "" ? (
                <ButtonClear className='mobile-form-view-site' onClick={viewSite} label="View site" />
              ) : (
                null
              )}
              </div>
              <Footer />
            </div>
          </>
          :
          <>
            <div className="app-wrapper">
              <Navbar title={title} email={user.email} onClickLogout={handleLogout} isFromForm={"newForm"} generatedUrl={generatedUrl} />

              <div className="folioform">
                <div className="row">
                  <div className="col-md-3 tab-container">
                    <ul className="nav flex-column nav-tabs vertical-tabs">
                      <li className="folio-form-nav-item">
                        <a className={`folio-form ${activeTab === 'tab1' ? 'active' : ''}`}
                          onClick={(e) => handleTabClick('tab1', e)}
                          href="#tab1">
                          General
                        </a>
                      </li>
                      <li className="folio-form-nav-item">
                        <a className={`folio-form ${activeTab === 'tab2' ? 'active' : ''}`}
                          onClick={(e) => handleTabClick('tab2', e)}
                          href="#tab2">
                          Figma Links
                        </a>
                      </li>
                      <li className="folio-form-nav-item">
                        <a className={`folio-form ${activeTab === 'tab3' ? 'active' : ''}`}
                          onClick={(e) => handleTabClick('tab3', e)}
                          href="#tab3">
                          Domain
                        </a>
                      </li>
                      <li className="folio-form-nav-item">
                        <a className={`folio-form ${activeTab === 'tab4' ? 'active' : ''}`}
                          onClick={(e) => handleTabClick('tab4', e)}
                          href="#tab4">
                          Favicon
                        </a>
                      </li>
                      <li className="folio-form-nav-item">
                        <a className={`folio-form ${activeTab === 'tab5' ? 'active' : ''}`}
                          onClick={(e) => handleTabClick('tab5', e)}
                          href="#tab5">
                          Password
                        </a>
                      </li>
                      <li className="folio-form-nav-item">
                        <a className={`folio-form ${activeTab === 'tab6' ? 'active' : ''}`}
                          onClick={(e) => handleTabClick('tab6', e)}
                          href="#tab6">
                          Need help?
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-9 folio-form-tab-content">
                    <div className="tab-content">
                      <div className={`tab-pane fade ${activeTab === 'tab1' ? 'show active' : ''}`} id="tab1">
                        <FormTitle onChildDataSubmit={handleTitle} setTitle={title} saveTitle={saveTitle} />
                      </div>
                      <div className={`tab-pane fade ${activeTab === 'tab2' ? 'show active' : ''}`} id="tab2">
                        <FormContent onChildDesktopUrl={handleFigmaDesktopUrl} onChildFigmaMobileUrl={handleFigmaMobileUrl} setFigmaMobileUrl={figmaMobileUrl} setFigmaDesktopUrl={figmaDesktopUrl} saveFigmaUrl={saveFigmaUrl} goToPreview={goToPreview} />
                      </div>
                      <div className={`tab-pane fade ${activeTab === 'tab3' ? 'show active' : ''}`} id="tab3">
                        <FormCustomDomain onChildDomain={handleDomain} setDomain={domain} saveDomain={saveDomain} subscriptionType={subscriptionType} trialConsume={trialConsume} generatedUrl={generatedUrl} />
                      </div>
                      <div className={`tab-pane fade ${activeTab === 'tab4' ? 'show active' : ''}`} id="tab4">
                        <FormFavicon onChildFavicon={handleFaviconImage} setFaviconImage={faviconImage} subscriptionType={subscriptionType} trialConsume = {trialConsume} />
                      </div>
                      <div className={`tab-pane fade ${activeTab === 'tab5' ? 'show active' : ''}`} id="tab5">
                        <FormPassword  onChildPasswordHandle={handlePassword} onChildPasswordStatusHandle={handlePasswordStatus} password={password} isPasswordActive= {isPasswordActive} sendNewPassword = {handleDataFromChild} sendNewPasswordStatus = { handlePasswordStatusFromChild}subscriptionType={subscriptionType} trialConsume = {trialConsume} />
                      </div>
                      <div className={`tab-pane fade ${activeTab === 'tab6' ? 'show active' : ''}`} id="tab6">
                        <FormInstruction />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Footer />
            </div>
            < AlertErrorModal show={showErrorModal} handleClose={handleCloseErrorModal} alertMessage={t('you-have-entered-a-link')} />
          </>
      }
    </>
  );
};

