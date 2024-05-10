import React, { useState, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../i18n';
import { auth } from '../../firebase';
import CustomDomainFunction from '../../components/CustomDomainInstruction/CustomDomainInstruction';
import ButtonColored from '../ButtonColored/ButtonColored';
import PaymentSelection from '../PaymentSelection/PaymentSelection';
import firebase from '../../firebase';
import { loadStripe } from '@stripe/stripe-js';
export default function FormCustomDomain(props) {
    const currentLanguage = i18n.language;
    const user = auth.currentUser;
    const dbFirestore = firebase.firestore();
    const subscriptionType = props.subscriptionType
    const [domain, setDomain] = useState(props.setDomain || "");
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDomain = (event) => {
        const stringDomain = event.target.value;
        setDomain(stringDomain);
        props.onChildDomain(stringDomain);
    };

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
            <h1 className='sub-title'>Free Domain</h1>
            {props.generatedUrl ?
                <p className='free-domain'>  www.figmafoliocom/{props.generatedUrl} </p>
                :
                null
            }

            {subscriptionType === "regular" ?

                <>
                    <h1 className='sub-title'>Custom Domain</h1>
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
                </>

                :
                <>
                    <h1 className='sub-title'>Custom Domain</h1>
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
                        <ButtonColored className="folio-form-save-btn" label={"Save"} onClick={props.saveDomain} />
                    </div>
                </>}

            <PaymentSelection show={showModal} handleClose={handleCloseModal}
                handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_MONTHLY)}
                handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_YEARLY)} />
        </>
    );
}