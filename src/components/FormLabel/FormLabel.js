import React, { useState, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../i18n';
import { auth } from '../../firebase';
import Form from 'react-bootstrap/Form';
import ButtonColored from '../ButtonColored/ButtonColored';
import PaymentSelection from '../PaymentSelection/PaymentSelection';
import firebase from '../../firebase';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import copyIcon from './../../assets/images/copytoclipboard.png';
import { loadStripe } from '@stripe/stripe-js';
import ButtonClear from '../ButtonClear/ButtonClear';
import PaymentSelectionLite from '../PaymentSelection/PaymentSelectionLite';
export default function FormLabel(props) {
    const currentLanguage = i18n.language;
    const user = auth.currentUser;
    const dbFirestore = firebase.firestore();
    const subscriptionType = props.subscriptionType;
    const trialConsume = props.trialConsume
    const [domain, setDomain] = useState(props.setDomain || "");
    const [showModal, setShowModal] = useState(false);
    const [isPasswordActive, setIsPasswordActive] = useState(props.isPasswordActive || false);
    const [password, setPassword] = useState(props.password || "");
    const [newPassword, setNewPassword] = useState(props.password || "");
    const [isError, setIsError] = useState(false);
    const [showChangePasswordContainer, setshowChangePasswordContainer] = useState(props.showChangePasswordContainer || false);

    const handleNewPassword = (event) => {
        const stringPassword = event.target.value
        setNewPassword(stringPassword);
        props.sendNewPassword(stringPassword)
        //Test
    };
    const handleSwitchChange = () => {
        const newPasswordActiveState = !isPasswordActive;
        setIsPasswordActive(newPasswordActiveState)
        props.sendNewPasswordStatus(newPasswordActiveState)
        setshowChangePasswordContainer(false);
        console.log("newPasswordActiveState" + newPasswordActiveState)
    };

    const handleSave = () => {


        if (newPassword.length < 6) {
            setIsError(true)
            setshowChangePasswordContainer(true);
            console.log("wentHere1")
        } else {
            props.onChildPasswordHandle()
            setshowChangePasswordContainer(false);
            setIsError(false)
        }

    }

    const handleShowModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const showChangePassword = (event) => {
        setshowChangePasswordContainer(!showChangePasswordContainer);
    };


    const litePayment = async (priceId) => {
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection
            ("checkout_sessions").add({
                price: priceId,
                quantity: 1,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
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

    return (
        <>
            {subscriptionType === "regular" ?
                <>
                    <div>
                        <h1 className='sub-title'>Figmafolio label</h1>
                        <p className='form-favicon-note-disabled'>A promotional "Made with Figmafolio" label shows on your site or portfolio. To gain full control over your portfolio's appearance, hide the label by upgrading your account.</p>

                        <div className='regular-user-message-container'>
                            <div className='row'>
                                <div className='col-md-8'>
                                    <h1 className='regular-user-header'>Own your brand</h1>
                                    <p className='regular-user-message'>Remove the "Made with Figmafolio" label with aone-time upgrade or explore our plans for more customization and features.</p>
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



                </>}
            <PaymentSelectionLite show={showModal} handleClose={handleCloseModal}
                handleLitePayment={() => litePayment(process.env.REACT_APP_LITE)}
                handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_BASIC)}
                handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_PRO)} />


        </>
    )
}