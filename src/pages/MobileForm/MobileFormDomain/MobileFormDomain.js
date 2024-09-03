import React, { useState, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../../i18n';
import '.././MobileForm.css'
import ButtonColored from '../../../components/ButtonColored/ButtonColored';
import { useNavigate, useLocation } from 'react-router-dom';
import firebase from '../../../firebase';
import { auth } from '../../../firebase';
import PaymentSelection from '../../../components/PaymentSelection/PaymentSelection';
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";
import CustomDomainFunction from '../../../components/CustomDomainInstruction/CustomDomainInstruction';
import Footer from '../../../components/Footer/Footer';
import MobileNavBar from '../MobileNavBar/MobileNavbar';
import bcrypt from 'bcryptjs';
export const MobileFormDomain = (props) => {
  const currentLanguage = i18n.language;
  const navigate = useNavigate();
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
  const [password, setPassword] = useState(
    location && location.state && location.state.object && location.state.object.password
      ? location.state.object.password
      : ""
  );
  const [isPasswordActive, setIsPasswordActive] = useState(
    location && location.state && location.state.object && location.state.object.isPasswordActive
      ? location.state.object.isPasswordActive
      : false
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

  const [subscriptionType, setSubscriptionType] = useState(location && location.state && location.state.subscriptionType ? location.state.subscriptionType : "");
  const [trialConsume, setTrialConsume] = useState(location && location.state && location.state.trialConsume ? location.state.trialConsume : "");
  const [oldDomain, setOldDomain] = useState(
    location && location.state && location.state.object && location.state.object.customDomain
      ? location.state.object.customDomain
      : ""
  );
  const [domain, setDomain] = useState(
    location && location.state && location.state.object && location.state.object.customDomain
      ? location.state.object.customDomain
      : ""
  );
  const [showModal, setShowModal] = useState(false);
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 83YzDqNvO4OoVtKXQXJ4mTyj'
  };
  var newCustomDomainData = {
    "name": domain
  };
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDomain = (event) => {
    setDomain(event.target.value);
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
  useEffect(() => {
    if (domain.startsWith('www.')) {
      setDomain(domain.slice(4));
    }
  }, [domain]);

  function editUrl(url) {
    const originalString = url;
    const wordToRemove = "https://";
    const hideUi = "&hide-ui=1"
    const hotspot = "&hotspot-hints=0"
    const embedHost = "www.figma.com/embed?embed_host=share&url=https%3A%2F%2F"
    var newUrl = ""
    var modifiedUrl = ""
    var modifiedString = removeWordFromString(originalString, wordToRemove);

    if (url.includes("content-scaling=responsive")) {
      modifiedString = encodeURIComponent(modifiedString)
    }
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
        if (!newUrl.includes("content-scaling=responsive")) {
          modifiedUrl = newUrl.replace(new RegExp("scaling=contain", 'g'), "scaling=scale-down-width");
          newUrl = modifiedUrl
        } else {
          newUrl = modifiedUrl
        }
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

  function removeWordFromString(inputString, wordToRemove) {
    const regex = new RegExp(`\\b${wordToRemove}\\b`, 'gi');
    const resultString = inputString.replace(regex, '');
    return resultString;
  }

  const saveDomain = async () => {
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
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

        const docRef = await dbFirestore.collection('user').doc(user.uid).collection("customDomain").doc(domain).set({
          userId: user.uid,
          title: title,
          isDraft: "false",
          customDomain: domain,
          password: password,
          status: "active",
          showInDashboard: false,
          encryptedPassword: hashPassword,
          isPasswordActive: isPasswordActive,
          faviconUrl: faviconImage,
          generatedUrl: randomurl,
          urls: {
            figmaDesktopUrl: editUrl(figmaDesktopUrl),
            figmaMobileUrl: editUrl(figmaMobileUrl)
          },
          createdAt: new Date(),
        });


        const docRef2 = await dbFirestore.collection('user').doc(user.uid).collection("url").doc(domain).set({
          userId: user.uid,
          title: title,
          isDraft: "false",
          customDomain: domain,
          password: password,
          status: "active",
          showInDashboard: false,
          encryptedPassword: hashPassword,
          isPasswordActive: isPasswordActive,
          faviconUrl: faviconImage,
          generatedUrl: randomurl,
          urls: {
            figmaDesktopUrl: editUrl(figmaDesktopUrl),
            figmaMobileUrl: editUrl(figmaMobileUrl)
          },
          createdAt: new Date(),
        });


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
          const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").doc(randomurl).set({
            userId: user.uid,
            title: title,
            isDraft: "false",
            customDomain: domain,
            status: "active",
            password: password,
            showInDashboard: false,
            encryptedPassword: hashPassword,
            isPasswordActive: isPasswordActive,
            faviconUrl: faviconImage,
            generatedUrl: randomurl,
            urls: {
              figmaDesktopUrl: editUrl(figmaDesktopUrl),
              figmaMobileUrl: editUrl(figmaMobileUrl)
            },
            createdAt: new Date(),
          });

          await dbFirestore.collection('user').doc(user.uid).collection("customDomain").doc(domain).set({
            userId: user.uid,
            title: title,
            isDraft: "false",
            status: "active",
            customDomain: domain,
            password: password,
            showInDashboard: false,
            encryptedPassword: hashPassword,
            isPasswordActive: isPasswordActive,
            faviconUrl: faviconImage,
            generatedUrl: randomurl,
            urls: {
              figmaDesktopUrl: editUrl(figmaDesktopUrl),
              figmaMobileUrl: editUrl(figmaMobileUrl)
            },
            createdAt: new Date(),
          });

          setDocId(randomurl);
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




  const MonthlyPayment = async (priceId) => {
    const docRef = await dbFirestore.collection('user').doc(user.uid).collection
      ("checkout_sessions").add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
        trial_period_days: trialConsume === "true" ? 0 : 7,
        allow_promotion_codes: true,
      })
    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        alert(error.message)
      }
      if (sessionId) {
        const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);
        stripe.redirectToCheckout({ sessionId })
      }
    })
  }

  const yearlyPayment = async (priceId) => {
    const docRef = await dbFirestore.collection('user').doc(user.uid).collection
      ("checkout_sessions").add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
        trial_period_days: trialConsume === "true" ? 0 : 30,
        allow_promotion_codes: true,
      })
    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();
      if (error) {
        alert(error.message)
      }
      if (sessionId) {
        const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);
        stripe.redirectToCheckout({ sessionId })
      }
    })
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

          {generatedUrl ?
            <>
              <h1 className='mobile-form-title-free-domain m-0'>Free domain</h1>
              <p className='mobile-free-domain m-0'>  www.figmafolio.com/{generatedUrl} </p>
            </>

            :
            null
          }

          {subscriptionType === "regular" ?

            <>
              <div>
                <h1 className='mobile-form-title-domain m-0'>Domain</h1>
                <h2 className='mobile-form-sub-header'>Domain name</h2>
                <input
                  className='mobile-form-input-disabled'
                  type="text"
                  placeholder={t('enter-your-domain')}
                  value={domain}
                  disabled
                  onChange={handleDomain}
                />
                <div className='regular-user-message-container'>
                  <div className='row'>
                    <div className='col-md-8'>
                      <h1 className='regular-user-header'> Your website deserves a custom domain</h1>
                      <p className='regular-user-message'> Take your website to the next level with a custom domain.</p>
                    </div>
                    <div className='upgrade-now-btn-container col-md-4'>
                      <ButtonColored className="mobile-form-upgrade-now" label="Upgrade now" onClick={handleShowModal} />
                    </div>
                  </div>
                </div>
              </div>
            </>

            :
            <>
              <h1 className='mobile-domain-sub-title'>Domain</h1>
              <h2 className='mobile-mobile-form-sub-header'>Domain name</h2>
              <div>
                <input
                  className='mobile-form-input'
                  type="text"
                  placeholder={t('enter-your-domain')}
                  value={domain}
                  onChange={handleDomain}
                />
                <CustomDomainFunction />
                <ButtonColored className="mobile-folio-form-save-btn" label={"Save"} onClick={saveDomain} />
              </div>
            </>}

          <PaymentSelection show={showModal} handleClose={handleCloseModal}
            handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_BASIC)}
            handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_PRO)} />
        </div>
        <Footer />
      </div>
    </>
  )
}
