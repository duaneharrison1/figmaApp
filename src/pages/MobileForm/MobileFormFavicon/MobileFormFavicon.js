import React, { useState, useEffect, useRef } from 'react';
import { t } from 'i18next';
import i18n from '../../../i18n';
import '.././MobileForm.css'
import ButtonColored from '../../../components/ButtonColored/ButtonColored';
import { useNavigate, useLocation } from 'react-router-dom';
import firebase from '../../../firebase';
import { auth, uploadFaviconUrl } from '../../../firebase';
import PaymentSelection from '../../../components/PaymentSelection/PaymentSelection';
import ButtonClear from '../../../components/ButtonClear/ButtonClear';
import { loadStripe } from '@stripe/stripe-js';
import Footer from '../../../components/Footer/Footer';
import MobileNavBar from '../MobileNavBar/MobileNavbar';
export const MobileFormFavicon = (props) => {
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

  const [domain, setDomain] = useState(
    location && location.state && location.state.object && location.state.object.customDomain
      ? location.state.object.customDomain
      : ""
  );

  const [subscriptionType, setSubscriptionType] = useState(location && location.state && location.state.subscriptionType ? location.state.subscriptionType : "");
  const [trialConsume, setTrialConsume] = useState(location && location.state && location.state.trialConsume ? location.state.trialConsume : "");
  const [image, setImage] = useState(
    location && location.state && location.state.object && location.state.object.faviconUrl
      ? location.state.object.faviconUrl
      : ""
  );
  const [showModal, setShowModal] = useState(false);

  const inputFile = useRef(null);
  const [imgFromLocal, setImgFromLocal] = useState("");
  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  const onButtonClick = (e) => {
    inputFile.current && inputFile.current.click();
  };

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
        trial_period_days: trialConsume === "true" ? 0 : 15,
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

  const handleFaviconImage = async (data) => {
    if (docId) {
      try {
        var faviconUrlFromFirebase = await uploadFaviconUrl(data, generatedUrl);
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").doc(docId).update({
          faviconUrl: faviconUrlFromFirebase,
          updatedAt: new Date()
        })

        if (domain) {
          await dbFirestore.collection('user').doc(user.uid).collection("customDomain").doc(domain).update({
            faviconUrl: faviconUrlFromFirebase,
            updatedAt: new Date()
          })
        }

        setFaviconImage(faviconUrlFromFirebase)
        alert("Success");



      } catch (error) {
        alert(error);
      }
    } else {
      try {
        var newFaviconImage = await uploadFaviconUrl(data, generatedUrl);
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").doc(randomurl).set({
          userId: user.uid,
          faviconUrl: newFaviconImage,
          isDraft: "false",
          generatedUrl: randomurl,
          createdAt: new Date(),
        })
        setGeneratedUrl(randomurl);
        setDocId(randomurl);
        setFaviconImage(newFaviconImage)
        alert("Success");
      } catch (error) {
        alert(error);
      }
    }
  }

  function handleChange(e) {
    if (e.target.files[0]) {
      setImgFromLocal(e.target.files[0])
      setImage(URL.createObjectURL(e.target.files[0]));
      handleFaviconImage(e.target.files[0]);
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
          <div className='row first-div'>
            <h1 className='mobile-form-title'>Favicon</h1>

            {subscriptionType === "regular" ?
              <>
                <div>
                  <p className='form-favicon-note-disabled'>This is a small icon which will represent your website at the top of a web browser and in browser's bookmark bar, history and in search results.</p>
                  <h2 className='mobile-form-sub-header'>Website Icon</h2>
                  <div className='button-img-upload-container'>
                    <ButtonClear className='mobile-form-upload-image-disabled' onClick={onButtonClick} label={image !== '' ? "Change image" : "Upload image"} />
                  </div>
                  <p className='form-favicon-note-disabled'>&#8226; Submit a PNG, JGP or SVG which is at least 70px x 70px. For best results, use an image which is 260px x 260px or more. </p>
                  <div className='regular-user-message-container'>
                    <div className='row'>
                      <div className='col-md-8'>
                        <h1 className='regular-user-header'> Your website deserves a little customization</h1>
                        <p className='regular-user-message'> Take your website to the next level by upgrading your Figmafolio plan</p>
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
                <p className='form-favicon-note'>This is a small icon which will represent your website at the top of a web browser and in browser's bookmark bar, history and in search results.</p>
                <h2 className='mobile-form-sub-header'>Website Icon</h2>
                <div>
                  {image !== '' ? <img src={image} className='favicon-prev' /> : null}
                </div>

                <div className='button-img-upload-container'>
                  <ButtonClear className='mobile-form-upload-image' onClick={onButtonClick} label={image !== '' ? "Change image" : "Upload image"} />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  id="file"
                  ref={inputFile}
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
                <p className='form-favicon-note'>&#8226; Submit a PNG, JGP or SVG which is at least 70px x 70px. For best results, use an image which is 260px x 260px or more. </p>
              </>
            }
          </div>
          <PaymentSelection show={showModal} handleClose={handleCloseModal}
            handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_BASIC)}
            handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_PRO)} />
        </div>
        <Footer />
      </div>
    </>
  )
}
