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
export const MobileFormDomain = (props) => {
  const currentLanguage = i18n.language;
  const dbFirestore = firebase.firestore();
  const user = auth.currentUser;
  const location = useLocation();
  const [randomurl, setRandomUrl] = useState('');
  const [docId, setDocId] = useState(location && location.state && location.state.object ? location.state.object.id : "");
  const [generatedUrl, setGeneratedUrl] = useState(location && location.state && location.state.object && location.state.object.generatedUrl ? location.state.object.generatedUrl : "");
  const [subscriptionType, setSubscriptionType] = useState(location && location.state && location.state.object && location.state.object.subscriptionType ? location.state.object.subscriptionType : "");
  const [oldDomain, setOldDomain] = useState(
    location && location.state && location.state.object && location.state.object.customDomain
      ? location.state.object.customDomain
      : ""
  );
  const [domain, setDomain] = useState(props.setDomain || "");
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


  const MonthlyPayment = async (priceId) => {
    const docRef = await dbFirestore.collection('user').doc(user.uid).collection
      ("checkout_sessions").add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin
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
        cancel_url: window.location.origin
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

  return (
    <>
    <div className='app-wrapper-mobile'>
            <div className='mobile-form-content-container'>
      <h1 className='sub-title'>Free domain</h1>
      {props.generatedUrl ?
        <p className='free-domain'>  www.figmafolio.com/{props.generatedUrl} </p>
        :
        null
      }

      {subscriptionType === "regular" ?

        <>
          <div>
            <h1 className='sub-title'>Domain</h1>
            <h2 className='form-sub-header-disable'>Domain name</h2>
            <input
              className='form-input-disabled'
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
                  <ButtonColored className="upgrade-now" label="Upgrade now" onClick={handleShowModal} />
                </div>
              </div>
            </div>
          </div>
        </>

        :
        <>
          <h1 className='sub-title'>Domain</h1>
          <h2 className='form-sub-header'>Domain name</h2>
          <div>
            <input
              className='form-input'
              type="text"
              placeholder={t('enter-your-domain')}
              value={domain}
              onChange={handleDomain}
            />
            <CustomDomainFunction />
            <ButtonColored className="folio-form-save-btn" label={"Save"} onClick={saveDomain} />
          </div>
        </>}

      <PaymentSelection show={showModal} handleClose={handleCloseModal}
        handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_MONTHLY)}
        handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_YEARLY)} />
        </div>
        <Footer/>
        </div>
    </>
  )
}
