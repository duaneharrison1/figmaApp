import React, { useState, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../../i18n';
import '.././MobileForm.css'
import ButtonColored from '../../../components/ButtonColored/ButtonColored';
import { useNavigate, useLocation } from 'react-router-dom';
import firebase from '../../../firebase';
import { auth } from '../../../firebase';
import Footer from '../../../components/Footer/Footer';
import MobileNavBar from '../MobileNavBar/MobileNavbar';

export const MobileFormTitle = (props) => {
  const currentLanguage = i18n.language;
  const dbFirestore = firebase.firestore();
  const user = auth.currentUser;
  const location = useLocation();
  const [randomurl, setRandomUrl] = useState('');


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

  const [subscriptionType, setSubscriptionType] = useState(location && location.state  && location.state.subscriptionType ? location.state.subscriptionType : "");
  const [trialConsume, setTrialConsume] = useState(location && location.state  && location.state.trialConsume ? location.state.trialConsume : "");
  
  const navigate = useNavigate();
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
    const handlePopState = () => {
      // URL changed!
      console.log("change");
    };

    window.addEventListener("popstate", handlePopState);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    setRandomUrl(generateRandomString(10))
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


  const handleTitle = (event) => {
    setTitle(event.target.value);
  };


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
  const backToMobileFolioForm = () => {
    navigate("/" + currentLanguage + "/folio-form",
    {
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
        }, subscriptionType : subscriptionType,
        trialConsume: trialConsume
      }
    }
    );
  }

  return (
    <>
      <div className='app-wrapper-mobile'>
        <MobileNavBar title={title} backToMobileFolioForm={backToMobileFolioForm} />
        <div className='mobile-form-title-container'>
          <h1 className='mobile-form-title'>{t('general')}</h1>
          <h2 className='mobile-form-sub-header'>{t('title')}</h2>
          <input
            className='mobile-form-input'
            type="text"
            placeholder={t('enter-your-site-name')}
            value={title}
            onChange={handleTitle}
          />
          <p className='form-title-notes'> This will set the title of your whole website as it appears at the top of the browser window and in search engines.</p>

          <ButtonColored className="mobile-folio-form-save-btn" label={"Save"} onClick={saveTitle} />

        </div>
        <Footer />
      </div>
    </>
  )
}
