import React, { useState, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../../i18n';
import '.././MobileForm.css'
import ButtonColored from '../../../components/ButtonColored/ButtonColored';
import { useNavigate, useLocation } from 'react-router-dom';
import firebase from '../../../firebase';
import { auth } from '../../../firebase';
import ButtonClear from '../../../components/ButtonClear/ButtonClear';
import AlertErrorModal from '../../../components/AlertErrorModal/AlertErrorModal';
import Footer from '../../../components/Footer/Footer';
import MobileNavBar from '../MobileNavBar/MobileNavbar';
export const MobileFormContent = (props) => {
  const currentLanguage = i18n.language;
  const navigate = useNavigate();
  const dbFirestore = firebase.firestore();
  const user = auth.currentUser;
  const location = useLocation();
  const [randomurl, setRandomUrl] = useState('');
  const [docId, setDocId] = useState(location && location.state && location.state.object ? location.state.object.id : "");
  const [generatedUrl, setGeneratedUrl] = useState(location && location.state && location.state.object && location.state.object.generatedUrl ? location.state.object.generatedUrl : "");
  const [figmaDesktopUrl, setFigmaDesktopUrl] = useState(location.state && location.state.object && location.state.object.urls && location.state.object.urls.figmaDesktopUrl ? location.state.object.urls.figmaDesktopUrl : "");
  const [figmaMobileUrl, setFigmaMobileUrl] = useState(location.state && location.state.object && location.state.object.urls && location.state.object.urls.figmaMobileUrl ? location.state.object.urls.figmaMobileUrl : "");
  const [title, setTitle] = useState(
    location && location.state && location.state.object && location.state.object.title
      ? location.state.object.title
      : ""
  );
  const [faviconImage, setFaviconImage] = useState(
    location && location.state && location.state.object && location.state.object.faviconUrl
      ? location.state.object.faviconUrl
      : ""
  );

  const [subscriptionType, setSubscriptionType] = useState(location && location.state && location.state.subscriptionType ? location.state.subscriptionType : "");
  const [trialConsume, setTrialConsume] = useState(location && location.state && location.state.trialConsume ? location.state.trialConsume : "");
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
  const [showErrorModal, setShowErrorModal] = useState(false);
  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };
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
  const handlefigmaDesktopUrl = (event) => {
    setFigmaDesktopUrl(event.target.value);
  };
  const handlefigmaMobileUrl = (event) => {
    setFigmaMobileUrl(event.target.value);
  };


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
          }, subscriptionType: subscriptionType,
          trialConsume: trialConsume
        }
      });
    } else {
      setShowErrorModal(true);
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
            urls: {
              figmaDesktopUrl: figmaDesktopUrl,
              figmaMobileUrl: figmaMobileUrl
            }
          }, subscriptionType: subscriptionType,
          trialConsume: trialConsume
        }
      }
    );
  }

  return (
    <>
      <div className='app-wrapper-mobile'>
        <MobileNavBar title={title} backToMobileFolioForm={backToMobileFolioForm} />
        <div className='mobile-form-content-container'>
          <h1 className='mobile-form-title'>Figma Links</h1>
          <p className='mobile-form-content-upper-notes'>Paste in the links of your desktop and mobile prototypes from Figma below to have them create your Figmafolio site. By adding separate desktop and mobile links, all viewers can easily preview your work on any device. We'll detect the device and show the appropriate prototype.</p>
          <h2 className='mobile-form-sub-header'>
            {t('desktop-prototype-link')}
          </h2>
          <div>
            <input
              className='mobile-form-input'
              type="text"
              placeholder={t('custom-desktop-url')}
              value={figmaDesktopUrl}
              onChange={handlefigmaDesktopUrl}

            />
          </div>
          <h2 className='mobile-form-sub-header'>
            {t('mobile-prototype-link')}
          </h2>
          <div>
            <input
              className='mobile-form-input'
              type="text"
              placeholder={t('custom-mobile-url')}
              value={figmaMobileUrl}
              onChange={handlefigmaMobileUrl}
            />
          </div>

          <p className='form-content-note'>Note:</p>
          <ul className='form-content-note-list'>
            <li>Paste in the link to a prototype or specific prototype flow, not the Figma file.</li>
            <li>If you only provide one prototype link, we will show that on both desktop and mobile.</li>
            <li>For best results, match prototype’s background colour to your sites background colour in Figma in prototype settings.</li>
          </ul>
          <ButtonClear className='mobile-form-go-to-preview' label="Preview" onClick={goToPreview} />
          <ButtonColored className="mobile-folio-form-content-save-btn" label={"Save"} onClick={saveFigmaUrl} />
        </div>
        < AlertErrorModal show={showErrorModal} handleClose={handleCloseErrorModal} alertMessage={t('you-have-entered-a-link')} />
        <Footer />
      </div>
    </>
  )
}
