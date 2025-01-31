import React, { useState, useRef, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../i18n';
import ButtonColored from '../ButtonColored/ButtonColored';
import ButtonClear from '../ButtonClear/ButtonClear';
import { auth } from '../../firebase';
import firebase from '../../firebase';
import { loadStripe } from '@stripe/stripe-js';
import PaymentSelection from '../PaymentSelection/PaymentSelection';
export default function FormFavicon(props) {
    const [imgFromLocal, setImgFromLocal] = useState("");
    const subscriptionType = props.subscriptionType
    const trialConsume = props.trialConsume
    const user = auth.currentUser;
    const dbFirestore = firebase.firestore();
    const [image, setImage] = useState(props.setFaviconImage || "");
    const inputFile = useRef(null);
    const currentLanguage = i18n.language;
    const [showModal, setShowModal] = useState(false);
    const handleShowModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };
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
        

    const MonthlyPayment = async (priceId) => {
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection
            ("checkout_sessions").add({
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
                trial_period_days : trialConsume === "true" ? 0 : 7,
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
                trial_period_days : trialConsume === "true" ? 0 : 15,
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

    function handleChange(e) {
        if (e.target.files[0]) {
            setImgFromLocal(e.target.files[0])
            setImage(URL.createObjectURL(e.target.files[0]));
            props.onChildFavicon(e.target.files[0]);
        }
    }

    const onButtonClick = (e) => {
        inputFile.current && inputFile.current.click();
    };


    return (
        <>
            <div className='row first-div'>
                <h1 className='form-title'>Favicon</h1>

                {subscriptionType === "regular" ?
                    <>
                    <div> 
                        <p className='form-favicon-note-disabled'>This is a small icon which will represent your website at the top of a web browser and in browser's bookmark bar, history and in search results.</p>
                        <h2 className='form-sub-header-disable'>Website Icon</h2>
                        <div className='button-img-upload-container'>
                            <ButtonClear className='upload-image-disabled' onClick={onButtonClick} label={image !== '' ? "Change image" : "Upload image"} />
                        </div>
                        <p className='form-favicon-note-disabled'>&#8226; Submit a PNG, JGP or SVG which is at least 70px x 70px. For best results, use an image which is 260px x 260px or more. </p>
                        <div className='regular-user-message-container'>
                            <div className='row'>
                                <div className='col-md-8'>
                                    <h1 className='regular-user-header'> Your website deserves a little customization</h1>
                                    <p className='regular-user-message'> Take your website to the next level by upgrading your Figmafolio plan</p>
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
                        <p className='form-favicon-note'>This is a small icon which will represent your website at the top of a web browser and in browser's bookmark bar, history and in search results.</p>
                        <h2 className='form-sub-header'>Website Icon</h2>

                        {image !== '' ? <img src={image} className='favicon-prev' /> : null}
                        <div className='button-img-upload-container'>
                            <ButtonClear className='upload-image' onClick={onButtonClick} label={image !== '' ? "Change image" : "Upload image"} />
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
            <PaymentSelection show={showModal} 
                dynamicPriceId={dynamicPriceId}
                handleClose={handleCloseModal}
                handleMonthlyPayment={() => MonthlyPayment(dynamicPriceId.monthlyPriceId)}
                handleYearlyPayment={() => yearlyPayment(dynamicPriceId.yearlyPriceId)} />
        </>
    );
}