import React, { useState, useRef } from 'react';
import { t } from 'i18next';
import i18n from '../../i18n';
import ButtonColored from '../ButtonColored/ButtonColored';
import ButtonClear from '../ButtonClear/ButtonClear';
import { auth } from '../../firebase';
import firebase from '../../firebase';
import { loadStripe } from '@stripe/stripe-js';
export default function FormFavicon(props) {
    const [imgFromLocal, setImgFromLocal] = useState("");
    const subscriptionType = props.subscriptionType
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
        </>
    );
}