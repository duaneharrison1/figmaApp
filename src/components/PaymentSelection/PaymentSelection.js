
import React, { useState } from 'react';
import './PaymentSelection.css';
import { Modal } from 'react-bootstrap';
import ButtonColored from '../ButtonColored/ButtonColored';
import { db, auth } from '../../firebase';
import Check from '../../assets/images/check.png';
import MostPopular from '../../assets/images/popular.png';
import { collection, addDoc, doc, getDocs, updateDoc, QuerySnapshot, query, where } from 'firebase/firestore'
const PaymentSelection = (props) => {
    const { show, handleClose, handleMonthlyPayment, handleYearlyPayment, monthlySubscription } = props;
    const user = auth.currentUser;


    return (
        <>

            <Modal dialogClassName='payment-selection-modal' show={show} onHide={handleClose} >
                <Modal.Body dialogClassName='payment-modal-body' >
                    <p> {monthlySubscription}</p>
                    <h1 className='payment-modal-header'>Pick a plan to suit your needs</h1>
                    <h2 className='payment-modal-subheader'> All plans are available with full functionality, please choose the right plan according to your needs</h2>
                    {monthlySubscription !== "monthlyPlan" ?
                        (
                            <div className='row'>

                                <div className='col-md-4'>
                                    <div className='regular-card'>
                                        <h1 className='payment-modal-selection-title'> Free</h1>
                                        <div className='amount-per-month'>
                                            <span className='amount'>$0 </span>
                                            <span className='month'>/month</span>
                                        </div>
                                        <h4 className='bill-desc'> Billed monthly at $0 </h4>
                                        <div className="payment-feature">
                                            <img className='check-icon' src={Check} />
                                            <h4 className='payment-feature-text'>5 projects/ websites</h4>
                                        </div>
                                        <div className="payment-feature">
                                            <img src={Check} />
                                            <h4 className='payment-feature-text'> Preset domains</h4>
                                        </div>
                                        <ButtonColored className="btn-current-plan" label="Current plan" />

                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='regular-card'>
                                        <h1 className='payment-modal-selection-title'> Monthly plan</h1>
                                        <div className='amount-per-month'>
                                            <span className='amount'>$5.0 </span>
                                            <span className='month'>/month</span>
                                        </div>
                                        <h4 className='bill-desc'> Billed monthly at $5.0 </h4>
                                        <div className="payment-feature">
                                            <img className='check-icon' src={Check} />
                                            <h4 className='payment-feature-text'>5 projects/ websites</h4>
                                        </div>
                                        <div className="payment-feature">
                                            <img className='check-icon' src={Check} />
                                            <h4 className='payment-feature-text'> Preset domains</h4>
                                        </div>
                                        {monthlySubscription == "monthlyPlan" ?
                                            (<ButtonColored className="btn-current-plan" label="Current plan" />) :
                                            (<ButtonColored className="btn-upgrade-plan" label="Upgrade plan" onClick={handleMonthlyPayment} />)
                                        }
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='green-card'>
                                        <div className="heading-container">
                                            <h1 className='payment-modal-selection-title'> Annual plan</h1>
                                            <img className='most-popular' src={MostPopular} />
                                        </div>

                                        <div className='amount-per-month'>
                                            <span className='amount'>$4.1 </span>
                                            <span className='month'>/month</span>
                                        </div>
                                        <h4 className='bill-desc'> Billed at one payment of $49</h4>
                                        <div className="payment-feature">
                                            <img className='check-icon' src={Check} />
                                            <h4 className='payment-feature-text'>Unlimited projects/websites</h4>
                                        </div>
                                        <div className="payment-feature">
                                            <img className='check-icon' src={Check} />
                                            <h4 className='payment-feature-text'>Use custom domains</h4>
                                        </div>
                                        <div className="payment-feature">
                                            <img className='check-icon' src={Check} />
                                            <h4 className='payment-feature-text'>priority technical and product support</h4>
                                        </div>
                                        <ButtonColored className="btn-upgrade-plan" label="Upgrade plan" onClick={handleYearlyPayment} />
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <div className='row justify-content-center'>
                                <div className='col-md-4'>
                                    <div className='regular-card'>
                                        <h1 className='payment-modal-selection-title'> Monthly plan</h1>
                                        <div className='amount-per-month'>
                                            <span className='amount'>$5.0 </span>
                                            <span className='month'>/month</span>
                                        </div>
                                        <h4 className='bill-desc'> Billed monthly at $5.0 </h4>
                                        <div className="payment-feature">
                                            <img className='check-icon' src={Check} />
                                            <h4 className='payment-feature-text'>5 projects/ websites</h4>
                                        </div>
                                        <div className="payment-feature">
                                            <img className='check-icon' src={Check} />
                                            <h4 className='payment-feature-text'> Preset domains</h4>
                                        </div>
                                        {monthlySubscription == "monthlyPlan" ?
                                            (<ButtonColored className="btn-current-plan" label="Current plan" />) :
                                            (<ButtonColored className="btn-upgrade-plan" label="Upgrade plan" onClick={handleMonthlyPayment} />)
                                        }
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div className='green-card'>
                                        <div className="heading-container">
                                            <h1 className='payment-modal-selection-title'> Annual plan</h1>
                                            <img className='most-popular' src={MostPopular} />
                                        </div>

                                        <div className='amount-per-month'>
                                            <span className='amount'>$4.1 </span>
                                            <span className='month'>/month</span>
                                        </div>
                                        <h4 className='bill-desc'> Billed at one payment of $49</h4>
                                        <div className="payment-feature">
                                            <img className='check-icon' src={Check} />
                                            <h4 className='payment-feature-text'>Unlimited projects/websites</h4>
                                        </div>
                                        <div className="payment-feature">
                                            <img className='check-icon' src={Check} />
                                            <h4 className='payment-feature-text'>Use custom domains</h4>
                                        </div>
                                        <div className="payment-feature">
                                            <img className='check-icon' src={Check} />
                                            <h4 className='payment-feature-text'>priority technical and product support</h4>
                                        </div>
                                        <ButtonColored className="btn-upgrade-plan" label="Upgrade plan" onClick={handleYearlyPayment} />
                                    </div>

                                </div>
                            </div>
                        )}

                </Modal.Body >
            </Modal >
        </>
    );
};

export default PaymentSelection;