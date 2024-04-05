
import React, { useState } from 'react';
import './UpgradeAlertModal.css';
import { Modal } from 'react-bootstrap';
import firebase from '../../firebase';
import ButtonColored from '../ButtonColored/ButtonColored';
import ButtonClear from '../ButtonClear/ButtonClear';
import { db, auth } from '../../firebase';
import { collection, addDoc, doc, getDocs, updateDoc, QuerySnapshot, query, where } from 'firebase/firestore'
import MostPopular from '../../assets/images/popular.png';
import { loadStripe } from '@stripe/stripe-js';
import Check from '../../assets/images/check.png';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const UpgradeAlertModal = (props) => {
    const { t } = useTranslation();
    const { show, handleClose } = props;
    const user = auth.currentUser;
    const [isSuccessful, setIsSuccessful] = useState(false);
    const dbFirestore = firebase.firestore();
    const stripeKey = String(process.env.KEY)
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
    const handleNotifyMe = async (event) => {
        event.preventDefault();
        setIsSuccessful(true)
    };

    return (
        <>



            {!isSuccessful ? (
                <Modal className='upgrade-modal' show={show} onHide={handleClose}>
                    <Modal.Body className='modal-body'>
                        <h1 className='upgrade-header'> You've reached your limit on websites</h1>
                        <h2 className='upgrade-subheader'> looks like youve hit your website limit. Please upgrade your plan to create a new project/website.</h2>
                        <ButtonColored className="btn-notify-me" label="Upgrade plan" onClick={handleNotifyMe} />
                        <ButtonClear className="btn-cancel" onClick={handleClose} label="Cancel" />
                    </Modal.Body >
                </Modal >
            ) : (
                <Modal dialogClassName='payment-selection-modal' show={show} onHide={handleClose} >
                    <Modal.Body dialogClassName='payment-modal-body' >
                        <h1 className='payment-modal-header'>{t('pick-a-plan')}</h1>
                        <h2 className='payment-modal-subheader'>{t('all-plans-are')}</h2>
                        <div className='row'>
                            <div className='col-md-4'>
                                <div className='regular-card'>
                                    <h1 className='payment-modal-selection-title'> Free</h1>
                                    <div className='amount-per-month'>
                                        <span className='amount'>$0 </span>
                                        <span className='month'>/month</span>
                                    </div>
                                    <h4 className='bill-desc'> No bills! </h4>
                                    <div className="payment-feature">
                                        <img className='check-icon' src={Check} />
                                        <h4 className='payment-feature-text'>5 projects/websites</h4>
                                    </div>
                                    <div className="payment-feature">
                                        <img className='check-icon' src={Check} />
                                        <h4 className='payment-feature-text'> Free Figmafolio domain</h4>
                                    </div>
                                    <ButtonColored className="btn-current-plan" label="Current plan" />

                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='regular-card'>
                                    <h1 className='payment-modal-selection-title'> Monthly</h1>
                                    <div className='amount-per-month'>
                                        <span className='amount'>$5 </span>
                                        <span className='month'>/month</span>
                                    </div>
                                    <h4 className='bill-desc'> Billed monthly at $5 USD </h4>
                                    <div className="payment-feature">
                                        <img className='check-icon' src={Check} />
                                        <h4 className='payment-feature-text'>5 projects/websites</h4>
                                    </div>
                                    <div className="payment-feature">
                                        <img className='check-icon' src={Check} />
                                        <h4 className='payment-feature-text'> Custom domains</h4>
                                    </div>
                                    <ButtonColored className="btn-upgrade-plan" label="Upgrade plan" onClick={MonthlyPayment} />
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='green-card'>
                                    <div className="heading-container">
                                        <h1 className='payment-modal-selection-title'> Yearly</h1>
                                        <img className='most-popular' src={MostPopular} />
                                    </div>

                                    <div className='amount-per-month'>
                                        <span className='amount'>4</span>
                                        <span className='month'>/month</span>
                                    </div>
                                    <h4 className='bill-desc'> Billed as one payment of $48 USD</h4>
                                    <div className="payment-feature">
                                        <img className='check-icon' src={Check} />
                                        <h4 className='payment-feature-text'>Unlimited projects/websites</h4>
                                    </div>
                                    <div className="payment-feature">
                                        <img className='check-icon' src={Check} />
                                        <h4 className='payment-feature-text'>Custom domains</h4>
                                    </div>
                                    <div className="payment-feature">
                                        <img className='check-icon' src={Check} />
                                        <h4 className='payment-feature-text'>Removes 'Made with Figmafolio' label</h4>
                                    </div>
                                    <div className="payment-feature">
                                        <img className='check-icon' src={Check} />
                                        <h4 className='payment-feature-text'>Priority technical and product support</h4>
                                    </div>
                                    <ButtonColored className="btn-upgrade-plan" label="Upgrade plan" onClick={yearlyPayment} />
                                </div>

                            </div>
                        </div>
                    </Modal.Body >
                </Modal >
            )}
        </>
    );
};

export default UpgradeAlertModal;
