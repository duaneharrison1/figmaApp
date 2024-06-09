import React, { useState, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../../i18n';
import '.././MobileForm.css'
import ButtonColored from '../../../components/ButtonColored/ButtonColored';
import { useNavigate, useLocation } from 'react-router-dom';
import firebase from '../../../firebase';
import { auth } from '../../../firebase';
import Footer from '../../../components/Footer/Footer';
import MobileNavBar from '../MobileNavBar/MobileNavbar';
import PaymentSelection from '../../../components/PaymentSelection/PaymentSelection';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import copyIcon from './../../../assets/images/copytoclipboard.png';
import { loadStripe } from '@stripe/stripe-js';
import Form from 'react-bootstrap/Form';
import ButtonClear from '../../../components/ButtonClear/ButtonClear';
import bcrypt from 'bcryptjs';
export const MobileFormPassword = (props) => {
    const currentLanguage = i18n.language;
    const dbFirestore = firebase.firestore();
    const user = auth.currentUser;
    const location = useLocation();
    const [randomurl, setRandomUrl] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newPassword, setNewPassword] = useState(props.password || "");

    const [showChangePasswordContainer, setshowChangePasswordContainer] = useState(false);
    const [docId, setDocId] = useState(
        location && location.state && location.state.object
            ? location.state.object.id
            : ""
    );

    const [title, setTitle] = useState(
        location && location.state && location.state.object && location.state.object.title
            ? location.state.object.title
            : ""
    );
    const [generatedUrl, setGeneratedUrl] = useState(
        location && location.state && location.state.object && location.state.object.generatedUrl
            ? location.state.object.generatedUrl
            : ""
    );
    const [faviconImage, setFaviconImage] = useState(
        location && location.state && location.state.object && location.state.object.faviconUrl
            ? location.state.object.faviconUrl
            : ""
    );

    const [figmaDesktopUrl, setFigmaDesktopUrl] = useState(
        location.state && location.state.object && location.state.object.urls && location.state.object.urls.figmaDesktopUrl
            ? location.state.object.urls.figmaDesktopUrl
            : ""
    );
    const [figmaMobileUrl, setFigmaMobileUrl] = useState(
        location.state && location.state.object && location.state.object.urls && location.state.object.urls.figmaMobileUrl
            ? location.state.object.urls.figmaMobileUrl
            : ""
    );

    const [domain, setDomain] = useState(
        location && location.state && location.state.object && location.state.object.customDomain
            ? location.state.object.customDomain
            : ""
    );
    const [password, setPassword] = useState(
        location && location.state && location.state.object && location.state.object.password
            ? location.state.object.password
            : ""
    );
    const [isPasswordActive, setIsPasswordActive] = useState(
        location && location.state && location.state.object && location.state.object.isPasswordActive
            ? location.state.object.isPasswordActive
            : false
    );

    const [subscriptionType, setSubscriptionType] = useState(location && location.state && location.state.subscriptionType ? location.state.subscriptionType : "");
    const [trialConsume, setTrialConsume] = useState(location && location.state && location.state.trialConsume ? location.state.trialConsume : "");

    const navigate = useNavigate();
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
        if (password == "") {
            setPassword(generateRandomString(6))
        }
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




    const backToMobileFolioForm = () => {
        navigate("/" + currentLanguage + "/folio-form",
            {
                state: {
                    object: {
                        id: docId,
                        title: title,
                        generatedUrl: generatedUrl,
                        faviconUrl: faviconImage,
                        customDomain: domain,
                        password: password,
                        isPasswordActive: isPasswordActive,

                        urls: {
                            figmaDesktopUrl: figmaDesktopUrl,
                            figmaMobileUrl: figmaMobileUrl
                        }
                    }, subscriptionType: subscriptionType,
                    trialConsume: trialConsume
                }
            }
        );
    }

    const handleNewPassword = (event) => {
        setPassword(event.target.value);
    };
    const handleSwitchChange = () => {
        setIsPasswordActive(!isPasswordActive)
        handlePassword();
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

    const handlePassword = async () => {
        if (password.length >= 6) {
            alert('Your password must be at least 6 characters long.');
          } else {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);
        try {
            if (docId) {
                const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").doc(docId).update({
                    password: password,
                    encryptedPassword: hashPassword,
                    isPasswordActive: isPasswordActive,
                    updatedAt: new Date()
                })
            } else {
                const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").add({
                    userId: user.uid,
                    password: password,
                    encryptedPassword: hashPassword,
                    isPasswordActive: isPasswordActive,
                    generatedUrl: randomurl,
                    createdAt: new Date(),
                })
                setGeneratedUrl(randomurl);
                setDocId(docRef.id);
            }
        } catch (err) {
            alert(err.message)
        } finally {
            alert("Success")
        }
    }
    }


    return (
        <>

            <div className='app-wrapper-mobile'>
                <MobileNavBar title={title} backToMobileFolioForm={backToMobileFolioForm} />
                <div className='mobile-form-title-container'>
                    <h1 className='mobile-form-title'>Password</h1>

                    <p className='form-favicon-note-disabled'>This is a small icon which will represent your website at the top of a web browser and in browser's bookmark bar, history and in search results.</p>

                    {subscriptionType === "regular" ?
                        <>
                            <div className='password-toggle-container'>
                                <div className='col-md-11'>
                                    <h1 className='enable-pass-protect-disabled'>Enable Password Protection</h1>
                                </div>
                                <div className='col-md-1   d-flex justify-content-end'>
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
                        </>
                        :
                        <>
                            <div className='enable-pass-protect-container'>
                                <div className='password-toggle-container'>
                                    <div className='col-sm-12'>
                                        <h1 className='enable-pass-protect'>Enable Password Protection</h1>
                                    </div>
                                    <div className='col-sm-1  d-flex justify-content-end' >
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

                            {isPasswordActive && (
                                <>
                                    {showChangePasswordContainer ? (
                                        <div className='form-password-save-container p-0 m-0'>

                                            <input
                                                className='form-input-password'
                                                type="text"
                                                placeholder="Enter new password"
                                                value={password}
                                                onChange={handleNewPassword}
                                            />


                                            <ButtonColored className="folio-form-password-save-btn" label={"Save"} onClick={handlePassword} />

                                        </div>
                                    ) : (
                                        <>
                                            <div className="copytoclipboard">
                                                <div className="copy-container">
                                                    <span className="copy-text">{password}</span>
                                                    <CopyToClipboard text={password}>
                                                        <button className="copy-button">
                                                            <img src={copyIcon} alt="Copy to clipboard" />
                                                        </button>
                                                    </CopyToClipboard>
                                                </div>
                                            </div>
                                            <ButtonClear className='form-change-password' onClick={showChangePassword} label="Change password" />
                                        </>
                                    )}
                                </>
                            )}
                        </>

                    }


                </div>

                <PaymentSelection show={showModal} handleClose={handleCloseModal}
                    handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_MONTHLY)}
                    handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_YEARLY)} />
                <Footer />
            </div>
        </>
    );
}
