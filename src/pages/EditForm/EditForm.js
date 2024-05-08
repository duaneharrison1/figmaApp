import React, { useState, useEffect, useRef } from 'react';
import firebase from '../../firebase';
import { useNavigate, NavLink, useParams, useLocation } from 'react-router-dom';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { loadStripe } from '@stripe/stripe-js';
import { signOut } from "firebase/auth";
import './EditForm.css';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import Navbar from '../../components/NavBar/Navbar';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import PaymentSelectionModal from '../../components/PaymentSelection/PaymentSelection';
import AlertErrorModal from '../../components/AlertErrorModal/AlertErrorModal';

import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import FormInstruction from '../../components/FormInstruction/FormInstruction';
import CustomDomainFunction from '../../components/CustomDomainInstruction/CustomDomainInstruction';
import UpgradeAccountButton from '../../components/UpgradeAccountButton/UpgradeAccountButton';
export default function EditForm() {

    const inputFile = useRef(null);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [figmaDesktopUrl, setDesktopCustomUrl] = useState(location.state.object.urls.figmaDesktopUrl);
    const [figmaMobileUrl, setfigmaMobileUrl] = useState(location.state.object.urls.figmaMobileUrl);
    const [generatedUrl, setgeneratedUrl] = useState(location.state.object.generatedUrl);
    const [title, setTitle] = useState(location.state.object.title);
    const [customDomain, setCustomDomain] = useState(location.state.object.customDomain);
    const [faviconImage, setFaviconImage] = useState(location.state.object.faviconUrl || "");
    const [imgUrl, setImgUrl] = useState(location.state.object.faviconUrl || "");
    const [newCustomDomain, setNewCustomDomain] = useState(location.state.object.customDomain);
    const user = auth.currentUser;
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const dbFirestore = firebase.firestore();
    const [subscriptionType, setSubscriptionType] = useState(location.state.subscriptionType);
    const [isNewFavicon, setIsNewFavicon] = useState("false");
    const lng = navigator.language;
    const currentLanguage = i18n.language;
    const handleShowErrorModal = () => {
        setShowErrorModal(true);
    };
    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const goToPreview = () => {
        if ((!figmaDesktopUrl.includes('figma.com/file') && !figmaMobileUrl.includes('figma.com/file')) &&
            (figmaMobileUrl.includes('figma.com/proto') || figmaMobileUrl.includes('figma.com/embed') ||
                figmaDesktopUrl.includes('figma.com/proto') || figmaDesktopUrl.includes('figma.com/embed'))) {
            navigate("/" + currentLanguage + '/preview', { state: { title: title, figmaMobileUrl: figmaMobileUrl, figmaDesktopUrl: figmaDesktopUrl, fromEdit: true, isDraft: location.state.object.isDraft, docId: location.state.object.id, generatedUrl: generatedUrl, domain: customDomain, newCustomDomain: newCustomDomain, imgUrl: isNewFavicon == "true" ? imgUrl : faviconImage, isNewFavicon: isNewFavicon } });
        } else {
            setShowErrorModal(true);
        }
    }

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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

    const handleCustomDomain = (event) => {
        setNewCustomDomain(event.target.value);
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
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

    function handleChange(e) {
        if (e.target.files[0]) {
            setImgUrl(e.target.files[0])
            setFaviconImage(URL.createObjectURL(e.target.files[0]));
            setIsNewFavicon("true");
        }
    }

    const onButtonClick = (e) => {
        inputFile.current && inputFile.current.click();
    };

    return (
        <>
            < Navbar email={user.email} onClickLogout={handleLogout} isFromForm={"editForm"} />

            <div className='form'>
                <div className="url-form">
                    <div className='form-container'>
                        <h1 className='form-title'>{t('general')}</h1>
                        <div className='row first-div'>
                            <div className='col-md-6'>
                                <h2 className='form-sub-header'>{t('title')}</h2>
                                <input
                                    className='form-input'
                                    type="text"
                                    placeholder={t('enter-your-site-name')}
                                    value={title}
                                    onChange={handleTitle} />
                            </div>
                            <div className='col-md-6'>
                                <div className='row'>
                                    {subscriptionType == "regular" ? (<div></div>) : (
                                        <div className='favicon-container'>
                                            <h2 className='form-sub-header'>Favicon</h2>
                                            <div className='row favicon-img-container'>
                                                {imgUrl !== '' || faviconImage !== '' ? <img src={faviconImage} className='favicon-prev' /> : null}
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
                                <p> figmafolio.com/{generatedUrl} </p>
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
                                            value={newCustomDomain}
                                            onChange={handleCustomDomain} />
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

                    <PaymentSelectionModal show={showModal} handleClose={handleCloseModal}
                        handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_MONTHLY)}
                        handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_YEARLY)} />
                    < AlertErrorModal show={showErrorModal} handleClose={handleCloseErrorModal} alertMessage={t('you-have-entered-a-link')} />
                </div>
            </div>

        </>
    );
};

