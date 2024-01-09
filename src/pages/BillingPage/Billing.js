import React, { useState, useEffect } from 'react';
import Navbar from '../../components/NavBar/Navbar';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import firebase from '../../firebase';
import { auth, db } from '../../firebase';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import './Billing.css';
import { loadStripe } from '@stripe/stripe-js';
import PaymentSelectionModal from '../../components/PaymentSelection/PaymentSelection';
export default function Billing() {
    const dbFirestore = firebase.firestore();
    const [subscriptionType, setSubscriptionType] = useState("");
    const [subscriptionTypeText, setSubscriptionTypeText] = useState("");
    const [subscriptionTypeDesc, setSubscriptionTypeDesc] = useState("");
    const [user, setUser] = useState(null);
    const [changeSubPlan, setChangeSubPlan] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [profile, setProfile] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {

                    await getDocs(collection(db, "user", user.uid, "profile"))
                        .then((querySnapshot) => {
                            const userProfile = querySnapshot.docs
                                .map((doc) => ({ ...doc.data(), id: doc.id }));
                            setProfile(userProfile);
                        })

                    await dbFirestore.collection('user').doc(user.uid).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
                        if (snapshot.empty) {
                            setSubscriptionType("regular")
                        } else {
                            snapshot.forEach(subscription => {
                                if (subscription.data().status == "active") {
                                    if (subscription.data().items[0].plan.id == process.env.REACT_APP_YEARLY) {
                                        setSubscriptionType("annualPlan")
                                    } else if (subscription.data().items[0].plan.id == process.env.REACT_APP_MONTHLY) {
                                        setSubscriptionType("monthlyPlan")
                                    } else {
                                        setSubscriptionType("regular")
                                    }
                                } else if (subscription.data().status == "canceled") {
                                    setSubscriptionType("regular")
                                } else {
                                    setSubscriptionType("regular")
                                }

                                if (subscriptionType == "regular") {
                                    setSubscriptionTypeDesc("Billed monthly at $0")
                                } else if (subscriptionType == "monthlyPlan") {
                                    setSubscriptionTypeText("Monthly Plan")
                                    setSubscriptionTypeDesc("Billed monthly at $5")
                                } else if (subscriptionType == "annualPlan") {
                                    setSubscriptionTypeDesc("Billed yearly at $48")
                                    setSubscriptionTypeText("Yearly Plan")
                                }
                            })
                        }
                    })
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            else {

            }

        };
        fetchData();
    }, [user]);

    const ManagePlan = () => {
        window.open('https://billing.stripe.com/p/login/cN24habbC4JMga44gg', '_blank');
    }

    const handleShowUpgradeModal = () => {
        setShowUpgradeModal(true);
    };

    const handleCloseUpgradeModal = () => {
        setShowUpgradeModal(false);
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
        if (changeSubPlan) {
            window.open('https://billing.stripe.com/p/login/cN24habbC4JMga44gg', '_blank');
        } else {
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
    }

    return (
        <>
            {!profile ?
                < Navbar className={"dashboardNavBar"} email={" "} isFromForm={false} />
                :
                <div>
                    {profile.map(profile => (
                        < Navbar className={"dashboardNavBar"} email={profile.name} isFromForm={false} />
                    ))}
                </div>
            }

            <div className='billing-card'>
                <div className='container-personal-information'>
                    <div className='container'>
                        <h1 className='profile-headers'> Billing</h1>
                    </div>
                    <div className='container profile-buttons-container'>

                    </div>

                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <h1 className='profile-sub-headers'>{subscriptionTypeText}</h1>
                            <h1 className='profile-sub-headers'>{subscriptionTypeDesc}</h1>
                        </div>
                        <div className='col-sm-6 d-flex justify-content-end'>
                            <ButtonClear label='Change plan' className="change-password" onClick={handleShowUpgradeModal} />

                        </div>

                        <div className='d-flex justify-content-end unsub-div'>
                            {subscriptionType != "" ?
                                (<ButtonClear label='Cancel plan' className="unsub-btn" onClick={ManagePlan} />) :
                                (<div> </div>)
                            }
                        </div>
                    </div>
                </div>
            </div>
            <PaymentSelectionModal

                monthlySubscription={subscriptionType}
                show={showUpgradeModal}
                handleClose={handleCloseUpgradeModal}
                handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_MONTHLY)}
                handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_YEARLY)} />
        </>

    )
}
