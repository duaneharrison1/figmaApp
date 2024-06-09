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
export default function FormPassword(props) {
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
    const [copied, setCopied] = useState(false);
    const [showChangePasswordContainer, setshowChangePasswordContainer] = useState(false);


    const handleNewPassword = (event) => {
        setNewPassword(event.target.value);
        props.sendNewPassword(newPassword)
    };
    const handleSwitchChange = () => {
        setIsPasswordActive(!isPasswordActive)
        props.sendNewPasswordStatus(isPasswordActive)
        props.onChildPasswordHandle();
    };

    const handleShowModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const showChangePassword = (event) => {
        setshowChangePasswordContainer(!showChangePasswordContainer);
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
                        <h1 className='sub-title'>Password</h1>
                        <p className='form-favicon-note-disabled'>This is a small icon which will represent your website at the top of a web browser and in browser's bookmark bar, history and in search results.</p>

                        <div className='password-toggle-container'>
                            <div className='col-sm-11'>
                                <h1 className='enable-pass-protect-disabled'>Enable Password Protection</h1>
                            </div>
                            <div className='col-sm-1'>
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    checked="false"
                                    onChange={handleSwitchChange}
                                    className="enable-pass-switch"
                                />
                            </div>
                        </div>



                        <div className='regular-user-message-container'>
                            <div className='row'>
                                <div className='col-md-8'>
                                    <h1 className='regular-user-header'>Need to keep things confidential?</h1>
                                    <p className='regular-user-message'>Upgrade your plan to share your work securely and ensure only the intended people see it.</p>
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

                    <h1 className='sub-title'>Password</h1>
                    <p className='form-favicon-note'>This is a small icon which will represent your website at the top of a web browser and in browser's bookmark bar, history and in search results.</p>
                    <div className='enable-pass-protect-container'>
                        <div className='password-toggle-container'>
                            <div className='col-sm-11'>
                                <h1 className='enable-pass-protect'>Enable Password Protection</h1>
                            </div>
                            <div className='col-sm-1'>
                                <Form.Check
                                    className='password-active-switch'
                                    type="switch"
                                    id="custom-switch"
                                    checked={isPasswordActive}
                                    onChange={handleSwitchChange}
                                />
                            </div>
                        </div>

                    </div>
                    {isPasswordActive &&
                        <>
                            {showChangePasswordContainer ? (
                                <div className='form-password-save-container p-0 m-0'>

                                    <input
                                        className='form-input-password'
                                        type="text"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={handleNewPassword}
                                    />


                                    <ButtonColored className="folio-form-password-save-btn" label={"Save"} onClick={props.onChildPasswordHandle} />

                                </div>
                            ) : (
                                <>
                                    <div className="copytoclipboard">
                                        <div className="copy-container">
                                            <span className="copy-text">{props.password}</span>
                                            <CopyToClipboard text={props.password}>
                                                <button className="copy-button">
                                                    <img src={copyIcon} alt="Copy to clipboard" />
                                                </button>
                                            </CopyToClipboard>
                                        </div>
                                    </div>
                                    <ButtonClear className='form-change-password' onClick={showChangePassword} label="Change password" />
                                </>
                            )}</>

                    }

                </>}

            <PaymentSelection show={showModal} handleClose={handleCloseModal}
                handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_MONTHLY)}
                handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_YEARLY)} />
        </>
    );
}