
// import React, { useState } from 'react';
// import './UpgradeAlertModal.css';
// import { Modal } from 'react-bootstrap';
// import firebase from '../../firebase';
// import ButtonColored from '../ButtonColored/ButtonColored';
// import ButtonClear from '../ButtonClear/ButtonClear';
// import { db, auth } from '../../firebase';
// import { collection, addDoc, doc, getDocs, updateDoc, QuerySnapshot, query, where } from 'firebase/firestore'
// import { loadStripe } from '@stripe/stripe-js';
// import Check from '../../assets/images/check.png';
// import { useTranslation } from 'react-i18next';
// import i18n from '../../i18n';

// const UpgradeAlertModal = (props) => {
//     const { t } = useTranslation();
//     const { show, handleClose } = props;
//     const user = auth.currentUser;
//     const [isSuccessful, setIsSuccessful] = useState(false);
//     const dbFirestore = firebase.firestore();
//     const stripeKey = String(process.env.KEY)
//     const MonthlyPayment = async (priceId) => {
//         const docRef = await dbFirestore.collection('user').doc(user.uid).collection
//             ("checkout_sessions").add({
//                 price: priceId,
//                 success_url: window.location.origin,
//                 cancel_url: window.location.origin
//             })
//         docRef.onSnapshot(async (snap) => {
//             const { error, sessionId } = snap.data();
//             if (error) {
//                 alert(error.message)
//             }
//             if (sessionId) {
//                 const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);
//                 stripe.redirectToCheckout({ sessionId })
//             }
//         })
//     }
//     const yearlyPayment = async (priceId) => {
//         const docRef = await dbFirestore.collection('user').doc(user.uid).collection
//             ("checkout_sessions").add({
//                 price: priceId,
//                 success_url: window.location.origin,
//                 cancel_url: window.location.origin
//             })
//         docRef.onSnapshot(async (snap) => {
//             const { error, sessionId } = snap.data();
//             if (error) {
//                 alert(error.message)
//             }
//             if (sessionId) {
//                 const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);
//                 stripe.redirectToCheckout({ sessionId })
//             }
//         })
//     }
//     const handleNotifyMe = async (event) => {
//         event.preventDefault();
//         setIsSuccessful(true)
//     };

//     return (
//         <>



//             {!isSuccessful ? (
//                 <Modal className='upgrade-modal' show={show} onHide={handleClose}>
//                     <Modal.Body className='modal-body'>
//                         <h1 className='upgrade-header'>{t('youve-reached-your-limit')}</h1>
//                         <h2 className='upgrade-subheader'> {t('looks-like-you-ve-hit-your-website-limit')}</h2>
//                         <ButtonColored className="btn-notify-me" label={t('upgrade-plan')} onClick={handleNotifyMe} />
//                         <ButtonClear className="btn-cancel" onClick={handleClose} label={t('cancel')} />
//                     </Modal.Body >
//                 </Modal >
//             ) : (
//                 <Modal dialogClassName='payment-selection-modal' show={show} onHide={handleClose} >
//                     <Modal.Body dialogClassName='payment-modal-body' >
//                         <h1 className='payment-modal-header'>{t('pick-a-plan')}</h1>
//                         <div className='row'>
//                             <div className='col-md-4'>
//                                 <div className='regular-card'>
//                                     <h1 className='payment-modal-selection-title'>{t('free')}</h1>
//                                     <div className='amount-per-month'>
//                                         <span className='amount'>$0 </span>
//                                         <span className='month'>/month</span>
//                                     </div>
//                                     <h4 className='bill-desc'> {t('no-bills')} </h4>
//                                     <div className="payment-feature">
//                                         <img className='check-icon' src={Check} />
//                                         <h4 className='payment-feature-text'>{t('monthly-feat-one')}</h4>
//                                     </div>
//                                     <div className="payment-feature">
//                                         <img className='check-icon' src={Check} />
//                                         <h4 className='payment-feature-text'> {t('free-feat-two')}</h4>
//                                     </div>
//                                     <ButtonColored className="btn-current-plan" label={t('current-plan')} />

//                                 </div>
//                             </div>
//                             <div className='col-md-4'>
//                                 <div className='regular-card'>
//                                     <h1 className='payment-modal-selection-title'> {t('monthly')}</h1>
//                                     <div className='amount-per-month'>
//                                         <span className='amount'>$5 </span>
//                                         <span className='month'>/month</span>
//                                     </div>
//                                     <h4 className='bill-desc'> {t('billed-monthly-at')} </h4>
//                                     <div className="payment-feature">
//                                         <img className='check-icon' src={Check} />
//                                         <h4 className='payment-feature-text'>{t('monthly-feat-one')}</h4>
//                                     </div>
//                                     <div className="payment-feature">
//                                         <img className='check-icon' src={Check} />
//                                         <h4 className='payment-feature-text'>{t('monthly-yearly-feat-two')}</h4>
//                                     </div>
//                                     <ButtonColored className="btn-upgrade-plan" label={t('upgrade-plan')} onClick={MonthlyPayment} />
//                                 </div>
//                             </div>
//                             <div className='col-md-4'>
//                                 <div className='green-card'>
//                                     <div className="heading-container">
//                                         <h1 className='payment-modal-selection-title'> {t('yearly')}</h1>
//                                     </div>

//                                     <div className='amount-per-month'>
//                                         <span className='amount'>4</span>
//                                         <span className='month'>/month</span>
//                                     </div>
//                                     <h4 className='bill-desc'> {t('billed-yearly-at')}</h4>
//                                     <div className="payment-feature">
//                                         <img className='check-icon' src={Check} />
//                                         <h4 className='payment-feature-text'>{t('yearly-feat-one')}</h4>
//                                     </div>
//                                     <div className="payment-feature">
//                                         <img className='check-icon' src={Check} />
//                                         <h4 className='payment-feature-text'>{t('monthly-yearly-feat-two')}</h4>
//                                     </div>
//                                     <div className="payment-feature">
//                                         <img className='check-icon' src={Check} />
//                                         <h4 className='payment-feature-text'>{t('removes-made-with')}</h4>
//                                     </div>
//                                     <div className="payment-feature">
//                                         <img className='check-icon' src={Check} />
//                                         <h4 className='payment-feature-text'>Customize Favicon</h4>
//                                     </div>
//                                     <div className="payment-feature">
//                                         <img className='check-icon' src={Check} />
//                                         <h4 className='payment-feature-text'>{t('monthly-yearly-feat-three')}</h4>
//                                     </div>
//                                     <ButtonColored className="btn-upgrade-plan" label={t('upgrade-plan')} onClick={yearlyPayment} />
//                                 </div>

//                             </div>
//                         </div>
//                     </Modal.Body >
//                 </Modal >
//             )}
//         </>
//     );
// };

// export default UpgradeAlertModal;
