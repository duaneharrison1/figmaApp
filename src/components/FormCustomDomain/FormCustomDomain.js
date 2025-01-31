import React, { useState, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../i18n';
import { auth } from '../../firebase';
import CustomDomainFunction from '../../components/CustomDomainInstruction/CustomDomainInstruction';
import ButtonColored from '../ButtonColored/ButtonColored';
import PaymentSelection from '../PaymentSelection/PaymentSelection';
import firebase from '../../firebase';
import { loadStripe } from '@stripe/stripe-js';
export default function FormCustomDomain(props) {
    const currentLanguage = i18n.language;
    const user = auth.currentUser;
    const dbFirestore = firebase.firestore();
    const subscriptionType = props.subscriptionType
    const trialConsume = props.trialConsume
    const [domain, setDomain] = useState(props.setDomain || "");
    const [showModal, setShowModal] = useState(false);
    const [dynamicPriceId, setDynamicPriceId] = useState(
                {
                    monthlyPriceId: process.env.REACT_APP_BASIC,
                    yearlyPriceId: process.env.REACT_APP_PRO
                }
            );

    const handleShowModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDomain = (event) => {
        const stringDomain = event.target.value;
        setDomain(stringDomain);
        props.onChildDomain(stringDomain);
    };

    const MonthlyPayment = async (priceId) => {
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection
            ("checkout_sessions").add({
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
                trial_period_days : trialConsume === "true" ? 0 : 7,
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
    
    

    const yearlyPayment = async (priceId) => {
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection
            ("checkout_sessions").add({
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
                trial_period_days : trialConsume === "true" ? 0 : 15,
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

    

    return (
        <>
            <h1 className='sub-title'>Free domain</h1>
            {props.generatedUrl ?
                <p className='free-domain'>  www.figmafolio.com/{props.generatedUrl} </p>
                :
                null
            }

            {subscriptionType === "regular" ?

                <>
                <div>
                    <h1 className='sub-title'>Domain</h1>
                    <h2 className='form-sub-header-disable'>Domain name</h2>
                    <input
                        className='form-input-disabled'
                        type="text"
                        placeholder={t('enter-your-domain')}
                        value={domain}
                        disabled
                        onChange={handleDomain}
                    />
                    <div className='regular-user-message-container'>
                        <div className='row'>
                            <div className='col-md-8'>
                                <h1 className='regular-user-header'> Your website deserves a custom domain</h1>
                                <p className='regular-user-message'> Take your website to the next level with a custom domain.</p>
                            </div>
                            <div className='upgrade-now-btn-container col-md-4'>
                                <ButtonColored className="upgrade-now" label="Upgrade now" onClick={handleShowModal} />
                            </div>
                        </div>
                    </div>
                    </div>
                </>

                :
                <>
                    <h1 className='sub-title'>Domain</h1>
                    <h2 className='form-sub-header'>Domain name</h2>
                    <div>
                        <input
                            className='form-input'
                            type="text"
                            placeholder={t('enter-your-domain')}
                            value={domain}
                            onChange={handleDomain}
                        />
                        <CustomDomainFunction />
                        <ButtonColored className="folio-form-save-btn" label={"Save"} onClick={props.saveDomain} />
                    </div>
                </>}

            <PaymentSelection show={showModal} 
                dynamicPriceId={dynamicPriceId}
                handleClose={handleCloseModal}
                handleMonthlyPayment={() => MonthlyPayment(dynamicPriceId.monthlyPriceId)}
                handleYearlyPayment={() => yearlyPayment(dynamicPriceId.yearlyPriceId)} />
        </>
    );
}