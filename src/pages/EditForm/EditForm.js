import React, { useState, useEffect } from 'react';
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
export default function EditForm() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [figmaDesktopUrl, setDesktopCustomUrl] = useState(location.state.object.urls.figmaDesktopUrl);
    const [figmaMobileUrl, setfigmaMobileUrl] = useState(location.state.object.urls.figmaMobileUrl);
    const [generatedUrl, setgeneratedUrl] = useState(location.state.object.generatedUrl);
    const [title, setTitle] = useState(location.state.object.title);
    const [customDomain, setCustomDomain] = useState(location.state.object.customDomain);
    const [newCustomDomain, setNewCustomDomain] = useState(location.state.object.customDomain);
    const user = auth.currentUser;
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const dbFirestore = firebase.firestore();
    const [subscriptionType, setSubscriptionType] = useState(location.state.subscriptionType);

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
            navigate('/preview', { state: { title: title, figmaMobileUrl: figmaMobileUrl, figmaDesktopUrl: figmaDesktopUrl, fromEdit: true, isDraft: location.state.object.isDraft, docId: location.state.object.id, generatedUrl: generatedUrl, domain: customDomain, newCustomDomain: newCustomDomain } });
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

    return (
        <>
            < Navbar className={"dashboardNavBar"} email={user.email} onClickLogout={handleLogout} isFromForm={"editForm"} />
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
                            <div className='col-md-6'></div>
                        </div>

                        <div className='row second-div'>
                            <div className='col-6 align-items-start'>
                                <h1 className='form-sub-header'>{t('your-domain')}</h1>
                                <p> figmafolio.com/{generatedUrl} </p>
                            </div>
                            <div className='col-md-6'>
                                <h2 className='form-sub-header'>{t('custom-domain')}</h2>


                                {subscriptionType == "regular" ? (
                                    <div>
                                        <p className='note'> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#424242" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" />
                                        </svg> {t('you-have-to-upgrade')}</p>
                                        <ButtonClear label='Upgrade account' className="upgrade-plan" onClick={handleShowModal} />
                                    </div>
                                ) : (

                                    <div>
                                        <input
                                            className='form-input'
                                            type="text"
                                            placeholder={t('enter-your-domain')}
                                            value={newCustomDomain}
                                            onChange={handleCustomDomain} />
                                        <div className='domain-info'>
                                            <p className='domain-info-header'>{t('custom-domain-instruct')}</p>
                                            <table className='domain-info-table'>
                                                <tr className='domain-info-subheader'>
                                                    <th>{t('type')}</th>
                                                    <th>{t('name')}</th>
                                                    <th>{t('value')}</th>
                                                </tr>
                                                <tr className='domain-info-one'>
                                                    <td>A</td>
                                                    <td>@</td>
                                                    <td>76.76.21.21</td>
                                                </tr>
                                                <tr className='domain-info-one'>
                                                    <td>CNAME</td>
                                                    <td>www</td>
                                                    <td>cname.vercel-dns.com</td>
                                                </tr>


                                                <p className='domain-info-header'>{t('custom-domain-instruct2')}</p>
                                            </table>
                                        </div>
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
                            <ButtonColored className="preview-btn" label="Preview" onClick={goToPreview} />
                        </div>

                        <FormInstruction />



                    </div>



                    <PaymentSelectionModal show={showModal} handleClose={handleCloseModal}
                        handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_MONTHLY)}
                        handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_YEARLY)} />
                    < AlertErrorModal show={showErrorModal} handleClose={handleCloseErrorModal} alertMessage={"You have entered a link to a Figma file. To publish your Figmafolio website, you must enter a link to a Figma prototype. Prototypes allow visitors to interact with your site."} />
                </div>
            </div>

        </>
    );
};

