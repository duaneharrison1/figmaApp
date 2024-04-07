import React, { useState, useEffect } from 'react';
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

    const goToPreview = () => {

        console.log(!figmaDesktopUrl.includes('figma.com/file'));

        if ((!figmaDesktopUrl.includes('figma.com/file') && !figmaMobileUrl.includes('figma.com/file')) &&
            (figmaMobileUrl.includes('figma.com/proto') || figmaMobileUrl.includes('figma.com/embed') ||
                figmaDesktopUrl.includes('figma.com/proto') || figmaDesktopUrl.includes('figma.com/embed'))) {
            navigate('/preview', { state: { title: title, figmaMobileUrl: figmaMobileUrl, figmaDesktopUrl: figmaDesktopUrl, domain: domain } });
        } else {
            setShowErrorModal(true);
        }


    }

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
            <Navbar className={"dashboardNavBar"} email={user.email} onClickLogout={handleLogout} isFromForm={"newForm"} />

            <div className='form'>
                <div className="url-form">
                    <div className='form-container'>
                        <div className='row first-div'>
                            <h1 className='form-title'>General</h1>
                            <div className='col-md-6'>
                                <h2 className='form-sub-header'>Title</h2>
                                <input
                                    className='form-input'
                                    type="text"
                                    placeholder='Enter your site name'
                                    value={title}
                                    onChange={handleTitle} />
                            </div>
                            <div className='col-md-6'></div>
                        </div>

                        <div className='row div-form-instruction'>
                            <div className='col-6 align-items-start'>
                                <h1 className='form-sub-header'>Your domain</h1>
                                <p>This will be assigned after clicking ‘Publish’.</p>
                            </div>
                            <div className='col-md-6'>
                                <h2 className='form-sub-header'>Custom domain</h2>
                                {subscriptionType == "regular" ?
                                    (
                                        <UpgradeAccountButton onClick={handleShowModal} />
                                    ) : (
                                        <div>
                                            <input
                                                className='form-input'
                                                type="text"
                                                placeholder='Enter your domain'
                                                value={domain}
                                                onChange={handleDomain} />
                                            <CustomDomainFunction />
                                        </div>
                                    )}
                            </div>
                        </div>
                        <div className="fifth-div">
                            <h1 className='sub-title'>Figma prototype links</h1>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <h2 className='form-sub-header'>
                                            Desktop prototype link
                                        </h2>
                                        <div>
                                            <input
                                                className='form-input'
                                                type="text"
                                                placeholder='Custom Desktop Url'
                                                value={figmaDesktopUrl}
                                                onChange={handlefigmaDesktopUrl}
                                            />
                                        </div>

                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="row">
                                        <h2 className='form-sub-header'>
                                            Mobile prototype link
                                        </h2>
                                        <div>
                                            <input
                                                className='form-input'
                                                type="text"
                                                placeholder='Custom Mobile Url'
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




                </div>
                <PaymentSelectionModal show={showModal} handleClose={handleCloseModal}
                    handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_MONTHLY)}
                    handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_YEARLY)} />
                < AlertErrorModal show={showErrorModal} handleClose={handleCloseErrorModal} alertMessage={"You have entered a link to a Figma file. To publish your Figmafolio website, you must enter a link to a Figma prototype. Prototypes allow visitors to interact with your site."} />
            </div>
        </>

    );
};

