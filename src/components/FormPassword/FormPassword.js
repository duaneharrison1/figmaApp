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
    const [isError, setIsError] = useState(false);
    const [showChangePasswordContainer, setshowChangePasswordContainer] = useState(props.showChangePasswordContainer || false);
    const [dynamicPriceId, setDynamicPriceId] = useState(
                        {
                            monthlyPriceId: process.env.REACT_APP_BASIC,
                            yearlyPriceId: process.env.REACT_APP_PRO
                        }
    );

     const getUserLocationAndSetPrice = async () => {
                        try {
                            const res = await fetch('https://ipinfo.io?token=b259d22dc84b2e');  // Replace with your API token
                            const data = await res.json();
                            const userCountry = data.country;
                
                            /**
                             * REACT_APP_MONTHLY_FIVE=price_1ONTZXJyvkMmBNuRWbYtaMwL
                                REACT_APP_MONTHLY_FOUR=price_1QmvdcJyvkMmBNuRZOGrSpsA
                                REACT_APP_MONTHLY_THREE=price_1QmvfaJyvkMmBNuRElK3XZi5
                                REACT_APP_MONTHLY_TWO=price_1QmvhMJyvkMmBNuRYc1fOenx
                
                                REACT_APP_YEARLY_FIVE=price_1ONTZvJyvkMmBNuRn0a8XUNq
                                REACT_APP_YEARLY_FOUR=price_1QmvecJyvkMmBNuRKYHIvIGc
                                REACT_APP_YEARLY_THREE=price_1QmvgMJyvkMmBNuR1BQgIkJO
                                REACT_APP_YEARLY_TWO=price_1QmviAJyvkMmBNuRVyuTidKP
                             */
                                
                                console.log('Country:', userCountry);
                
                
                            const countryGroups = {
                                "highestPricedCountries":["US"],
                                "highPricedCountries":["IE", "GB", "FR", "JP", "KR", "IL", "IT"],
                                "mediumPricedCountries": ["TW", "ES", "PT", "PL"],
                                "lowPricedCountries":["MY", "CN", "AR", "BR"],
                                "lowestPricedCountries":["TH", "VN", "ID", "PH", "IN", "NG"]  
                            }
                
                            // Set dynamic price IDs based on country
                            if (countryGroups.highestPricedCountries.includes(userCountry)) {
                                setDynamicPriceId({
                                    monthlyPriceId: process.env.REACT_APP_BASIC,
                                    yearlyPriceId: process.env.REACT_APP_PRO,
                                });
                            } else if (countryGroups.highPricedCountries.includes(userCountry)) {
                                setDynamicPriceId({
                                    monthlyPriceId: process.env.REACT_APP_MONTHLY_FIVE,  // Assume you have a separate price ID for GB
                                    yearlyPriceId: process.env.REACT_APP_YEARLY_FIVE,
                                });
                            } else if (countryGroups.mediumPricedCountries.includes(userCountry)) {
                                setDynamicPriceId({
                                    monthlyPriceId: process.env.REACT_APP_MONTHLY_FOUR,  // Assume you have a separate price ID for IN
                                    yearlyPriceId: process.env.REACT_APP_YEARLY_FOUR,
                                });
                            } else if (countryGroups.lowPricedCountries.includes(userCountry)) {
                                setDynamicPriceId({
                                    monthlyPriceId: process.env.REACT_APP_MONTHLY_THREE,  // Assume you have a separate price ID for IN
                                    yearlyPriceId: process.env.REACT_APP_YEARLY_THREE,
                                });
                            } else if (countryGroups.lowestPricedCountries.includes(userCountry)) {
                                setDynamicPriceId({
                                    monthlyPriceId: process.env.REACT_APP_MONTHLY_TWO,  // Assume you have a separate price ID for IN
                                    yearlyPriceId: process.env.REACT_APP_YEARLY_TWO,
                                });
                            } else {
                                // Default to US prices if country is unknown
                                setDynamicPriceId({
                                    monthlyPriceId: process.env.REACT_APP_BASIC,
                                    yearlyPriceId: process.env.REACT_APP_PRO,
                                });
                            }
                        } catch (error) {
                            console.error('Error fetching location:', error);
                        }
                    };
                    useEffect(() => {
                            getUserLocationAndSetPrice(); // Fetch location and set price IDs on component mount
                        }, []);
            

    const handleNewPassword = (event) => {
        const stringPassword = event.target.value
        setNewPassword(stringPassword);
        props.sendNewPassword(stringPassword)
    };
    const handleSwitchChange = () => {
        const newPasswordActiveState = !isPasswordActive;
        setIsPasswordActive(newPasswordActiveState)
        props.sendNewPasswordStatus(newPasswordActiveState)
        setshowChangePasswordContainer(false);
    };

    const handleSave = () => {


        if (newPassword.length < 6) {
            setIsError(true)
            setshowChangePasswordContainer(true);
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

    return (
        <>
            {subscriptionType === "regular" ?
                <>
                    <div>
                        <h1 className='sub-title'>Password</h1>
                        <p className='form-favicon-note-disabled'>Add an extra layer of security to your site or portfolio by requiring viewers to enter a password before they can access your work. This is helpful if you're sharing sensitive information or want to control who sees your work.</p>

                        <div className='password-toggle-container'>
                            <div className='col-sm-11'>
                                <h1 className='enable-pass-protect-disabled'>Enable Password Protection</h1>
                            </div>
                            <div className='col-sm-1'>
                                <Form.Check
                                    disabled
                                    type="switch"
                                    id="custom-switch"
                                    checked={false}
                                    className='password-active-switch'
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
                    <p className='form-favicon-note'>Add an extra layer of security to your site or portfolio by requiring viewers to enter a password before they can access your work. This is helpful if you're sharing sensitive information or want to control who sees your work.</p>
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
                                <>
                                    <div className='form-password-save-container m-0'>
                                        <input
                                            className='form-input-password'
                                            type="text"
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={handleNewPassword}
                                        />
                                        <ButtonColored className="folio-form-password-save-btn" label={"Save"} onClick={handleSave} />
                                    </div>
                                    {isError == true && < p className='error-message'>Your password must be at least 6 characters long.</p>}
                                </>
                            ) : (
                                <>
                                    <p className='password-to-access'> Password to access {props.title}:</p>
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

                <PaymentSelection show={showModal} 
                dynamicPriceId={dynamicPriceId}
                handleClose={handleCloseModal}
                handleMonthlyPayment={() => MonthlyPayment(dynamicPriceId.monthlyPriceId)}
                handleYearlyPayment={() => yearlyPayment(dynamicPriceId.yearlyPriceId)} />
        </>
    );
}