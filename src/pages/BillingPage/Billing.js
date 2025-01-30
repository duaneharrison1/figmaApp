import React, { useState, useEffect } from 'react';
import Navbar from '../../components/NavBar/Navbar';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import firebase from '../../firebase';
import { auth, db } from '../../firebase';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import './Billing.css';
import { loadStripe } from '@stripe/stripe-js';
import PaymentSelectionModal from '../../components/PaymentSelection/PaymentSelection';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
//test

export default function Billing() {
    const { t } = useTranslation();
    const dbFirestore = firebase.firestore();
    const [subscriptionType, setSubscriptionType] = useState("");
    const [subscriptionTypeText, setSubscriptionTypeText] = useState("");
    const [subscriptionTypeDesc, setSubscriptionTypeDesc] = useState("");
    const [user, setUser] = useState(null);
    const [changeSubPlan, setChangeSubPlan] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [name, setName] = useState([]);
    const lng = navigator.language;
    const [trialConsume, setTrialConsume] = useState(null)
    const [dynamicPriceId, setDynamicPriceId] = useState(
        {
            monthlyPriceId: process.env.REACT_APP_BASIC,
            yearlyPriceId: process.env.REACT_APP_PRO
        }
    )





    // useEffect(() => {

    //     i18n.changeLanguage(lng);
    // }, [])
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = () => {
            if (user) {
                try {
                    dbFirestore.collection('user').doc(user.uid).get().then(snapshot => {
                        setName(snapshot.data().name)
                    }).then(
                        dbFirestore.collection('user').doc(user.uid).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
                            if (snapshot.empty) {
                                setSubscriptionType("regular");
                                setSubscriptionTypeDesc(t('billed-monthly-at-o'));
                            } else {
                                let currentSubscriptionType = "regular";
                                let subscriptionDesc = t('billed-monthly-at-o');
                                
                                snapshot.forEach(subscription => {
                                    const subscriptionData = subscription.data();
                                    const status = subscriptionData.status;
                                    const planId = subscriptionData.items[0].plan.id;
                            
                                    if (status === "active") {
                                        // Check for Monthly Plans
                                        if (
                                            planID === process.env.REACT_APP_BASIC||
                                            planId === process.env.REACT_APP_MONTHLY_FIVE ||
                                            planId === process.env.REACT_APP_MONTHLY_FOUR ||
                                            planId === process.env.REACT_APP_MONTHLY_THREE ||
                                            planId === process.env.REACT_APP_MONTHLY_TWO
                                        ) {
                                            currentSubscriptionType = "monthlyPlan";
                                            subscriptionDesc = t('billed-monthly-at-five'); // Adjust description based on plan
                                        }
                                        // Check for Yearly Plans
                                        else if (
                                            planID === process.env.REACT_APP_PRO||
                                            planId === process.env.REACT_APP_YEARLY_FIVE ||
                                            planId === process.env.REACT_APP_YEARLY_FOUR ||
                                            planId === process.env.REACT_APP_YEARLY_THREE ||
                                            planId === process.env.REACT_APP_YEARLY_TWO
                                        ) {
                                            currentSubscriptionType = "annualPlan";
                                            subscriptionDesc = t('billed-as-one-payment'); // Adjust description for yearly
                                        }
                                        else {
                                            currentSubscriptionType = "regular";
                                        }
                                    } else if (status === "canceled") {
                                        currentSubscriptionType = "regular";
                                        subscriptionDesc = t('billed-monthly-at-o');
                                        setTrialConsume("true");
                                    }
                                });
                            
                                setSubscriptionType(currentSubscriptionType);
                            
                                // Set text and description based on the final subscription type
                                switch (currentSubscriptionType) {
                                    case "regular":
                                        setSubscriptionTypeDesc(subscriptionDesc);
                                        break;
                                    case "monthlyPlan":
                                        setSubscriptionTypeText("Monthly Plan");
                                        setSubscriptionTypeDesc(subscriptionDesc);
                                        break;
                                    case "annualPlan":
                                        setSubscriptionTypeText("Yearly Plan");
                                        setSubscriptionTypeDesc(subscriptionDesc);
                                        break;
                                    default:
                                        setSubscriptionTypeDesc(subscriptionDesc);
                                }
                            }
                            

                        })
                    )
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            else {

            }
        };
        fetchData();
    }, [user, subscriptionType]);



     // Function to fetch user country and adjust pricing accordingly
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
        if (changeSubPlan) {
            window.open('https://billing.stripe.com/p/login/cN24habbC4JMga44gg', '_blank');
        } else {
            const docRef = await dbFirestore.collection('user').doc(user.uid).collection
                ("checkout_sessions").add({
                    price: priceId,
                    success_url: window.location.origin,
                    cancel_url: window.location.origin,
                    trial_period_days: trialConsume === "true" ? 0 : 15,
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
    }

    return (
        <>
            {!name ?
                < Navbar email={user.email} isFromForm={"false"} />
                :
                <div>
                    < Navbar email={name} isFromForm={"false"} />
                </div>
            }

            <div className='billing-card'>
                <div className='container-personal-information'>
                    <div className='container'>
                        <h1 className='profile-headers'> {t('billing')}</h1>
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
                            <ButtonClear label={t('change-plan')} className="change-password" onClick={handleShowUpgradeModal} />

                        </div>

                        <div className='d-flex justify-content-end unsub-div'>
                            {subscriptionType != "regular" ?
                                (<ButtonClear label={t('cancel-plan')} className="unsub-btn" onClick={ManagePlan} />) :
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
                handleMonthlyPayment={() => MonthlyPayment(dynamicPriceId.monthlyPriceId)}
                handleYearlyPayment={() => yearlyPayment(dynamicPriceId.yearlyPriceId)} />
        </>

    )
}
