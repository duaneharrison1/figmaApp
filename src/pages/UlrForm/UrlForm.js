import React, { useState, useRef, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc, query, where } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import firebase from '../../firebase';
import { signOut } from "firebase/auth";
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import './UrlForm.css';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import Navbar from '../../components/NavBar/Navbar';
import PaymentSelectionModal from '../../components/PaymentSelection/PaymentSelection';
import { loadStripe } from '@stripe/stripe-js';
import AlertErrorModal from '../../components/AlertErrorModal/AlertErrorModal';
import FormInstruction from '../../components/FormInstruction/FormInstruction';
import CustomDomainFunction from '../../components/CustomDomainInstruction/CustomDomainInstruction';
import UpgradeAccountButton from '../../components/UpgradeAccountButton/UpgradeAccountButton';
import { t } from 'i18next';
import i18n from '../../i18n';
export default function UrlForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [figmaDesktopUrl, setDesktopCustomUrl] = useState('');
    const [figmaMobileUrl, setfigmaMobileUrl] = useState('');
    const [title, setTitle] = useState('');
    const [domain, setDomain] = useState('');
    const user = auth.currentUser;
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const dbFirestore = firebase.firestore();
    const [subscriptionType, setSubscriptionType] = useState(location.state.subscriptionType);
    const lng = navigator.language;
    const currentLanguage = i18n.language;
    const [imgUrl, setImgUrl] = useState('');
    const [image, setImage] = useState('')
    const inputFile = useRef(null);
    const [dynamicPriceId, setDynamicPriceId] = useState(
        {
            monthlyPriceId: process.env.REACT_APP_BASIC,
            yearlyPriceId: process.env.REACT_APP_PRO
        }
    );
    const handleShowModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowErrorModal = () => {
        setShowErrorModal(true);
    };
    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };


    const handlefigmaDesktopUrl = (event) => {
        setDesktopCustomUrl(event.target.value);
    };
    const handlefigmaMobileUrl = (event) => {
        setfigmaMobileUrl(event.target.value);
    };

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };
    const handleDomain = (event) => {
        setDomain(event.target.value);
    };



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
                console.log('Dynamic Price IDs:', dynamicPriceId);


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



    const goToPreview = () => {
        if ((!figmaDesktopUrl.includes('figma.com/file') && !figmaMobileUrl.includes('figma.com/file')) &&
            (figmaMobileUrl.includes('figma.com/proto') || figmaMobileUrl.includes('figma.com/embed') ||
                figmaDesktopUrl.includes('figma.com/proto') || figmaDesktopUrl.includes('figma.com/embed'))) {
            navigate("/" + currentLanguage + '/preview', { state: { title: title, figmaMobileUrl: figmaMobileUrl, figmaDesktopUrl: figmaDesktopUrl, domain: domain, imgUrl: imgUrl } });
        } else {
            setShowErrorModal(true);
        }
    }


    function handleChange(e) {
        if (e.target.files[0]) {
            setImgUrl(e.target.files[0])
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    const onButtonClick = (e) => {
        // `current` points to the mounted file input element
        inputFile.current && inputFile.current.click();

    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate(currentLanguage + "/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
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
                cancel_url: window.location.origin,
                trial_period_days: 30,
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
            <Navbar email={user.email} onClickLogout={handleLogout} isFromForm={"newForm"} />

            <div className='form'>
                <div className="url-form">
                    <div className='form-container'>
                        <div className='row first-div'>
                            <h1 className='form-title'>{t('general')}</h1>
                            <div className='col-md-6 form-title-div'>
                                <h2 className='form-sub-header'>{t('title')}</h2>
                                <input
                                    className='form-input'
                                    type="text"
                                    placeholder={t('enter-your-site-name')}
                                    value={title}
                                    onChange={handleTitle} />
                            </div>
                            <div className='col-md-6 '>
                                <div className='row'>
                                    {subscriptionType == "regular" ? (<div></div>) : (
                                        <div className='favicon-container'>
                                            <h2 className='form-sub-header'>Favicon</h2>
                                            <div className='row favicon-img-container'>
                                                {imgUrl !== '' || image !== '' ? <img src={image} className='favicon-prev' /> : null}
                                                <ButtonClear className='upload-image' onClick={onButtonClick} label="Upload image" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="file"
                                                    ref={inputFile}
                                                    onChange={handleChange}
                                                    style={{ display: "none" }}
                                                />
                                            </div>
                                            <p className='form-favicon-note'>Submit a PNG, JGP or SVG which is at least 70px x 70px. For best results, use an image which is 260px x 260px or more. </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='row div-form-instruction'>
                            <h1 className='sub-title'>Domain</h1>
                            <div className='col-6 align-items-start'>

                                <h1 className='form-sub-header'>{t('your-domain')}</h1>
                                <p>{t('this-will-be-assigned')}</p>
                            </div>
                            <div className='col-md-6'>

                                <h2 className='form-sub-header'>{t('custom-domain')}</h2>
                                {subscriptionType == "regular" ? (
                                    <UpgradeAccountButton onClick={handleShowModal} />
                                ) : (
                                    <div>

                                        <input
                                            className='form-input'
                                            type="text"
                                            placeholder={t('enter-your-domain')}
                                            value={domain}
                                            onChange={handleDomain} />
                                        <CustomDomainFunction />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="fifth-div">
                            <h1 className='sub-title'>{t('figma-prototype-links')}</h1>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <h2 className='form-sub-header'>
                                            {t('desktop-prototype-link')}
                                        </h2>
                                        <div>
                                            <input
                                                className='form-input'
                                                type="text"
                                                placeholder={t('custom-desktop-url')}
                                                value={figmaDesktopUrl}
                                                onChange={handlefigmaDesktopUrl}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="row">
                                        <h2 className='form-sub-header'>
                                            {t('mobile-prototype-link')}
                                        </h2>
                                        <div>
                                            <input
                                                className='form-input'
                                                type="text"
                                                placeholder={t('custom-mobile-url')}
                                                value={figmaMobileUrl}
                                                onChange={handlefigmaMobileUrl}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='preview-btn-container'>
                            <ButtonColored className="preview-btn" label={t('preview')} onClick={goToPreview} />
                        </div>

                        <FormInstruction />
                    </div>
                </div>
                <PaymentSelectionModal show={showModal} handleClose={handleCloseModal}
                     dynamicPriceId={dynamicPriceId}
                     handleMonthlyPayment={() => MonthlyPayment(dynamicPriceId.monthlyPriceId)}
                     handleYearlyPayment={() => yearlyPayment(dynamicPriceId.yearlyPriceId)} />
                < AlertErrorModal show={showErrorModal} handleClose={handleCloseErrorModal} alertMessage={t('you-have-entered-a-link')} />
            </div>
        </>

    );
};

