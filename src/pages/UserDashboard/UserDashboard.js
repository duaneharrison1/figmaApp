import React from 'react';
import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import firebase from '../../firebase';
import CardView from '../../components/CardView/CardView';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import './UserDashboard.css';
import Navbar from '../../components/NavBar/Navbar';
import { loadStripe } from '@stripe/stripe-js';
import PaymentSelectionModal from '../../components/PaymentSelection/PaymentSelection';
import Footer from '../../components/Footer/Footer';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import EmptyCardView from '../../components/EmptyCardView/EmptyCardView';
import NewSiteButton from '../../components/NewSiteButton/NewSiteButton';

function UserDashboard() {
    const currentLanguage = i18n.language;
    const { t } = useTranslation();
    const [userIsDesktop, setUserIsDesktop] = useState(true);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [profile, setProfile] = useState([]);
    const [upgradeClick, setUpgradeClick] = useState(false);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(null);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [canCreate, setCanCreate] = useState(null);
    const [docCount, setDocCount] = useState(null)
    const [subscriptionType, setSubscriptionType] = useState("")
    const [changeSubPlan, setChangeSubPlan] = useState(null)
    const dbFirestore = firebase.firestore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = "https://firebasestorage.googleapis.com/v0/b/figmawebapp.appspot.com/o/figmafolio-favicon.png?alt=media&token=3b9cc2d9-01c6-470e-910a-a64c168ed870?v=2";
    }, []);


    useEffect(() => {
        window.innerWidth > 1280 ? setUserIsDesktop(true) : setUserIsDesktop(false);
    }, [userIsDesktop]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        const fetchData = () => {
            if (user) {
                try {
                    dbFirestore.collection("user").doc(user.uid).collection("url").orderBy('createdAt', 'desc').get().then(querySnapshot => {
                        const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                        setData(newData);
                        setDocCount(querySnapshot.size)
                        dbFirestore.collection('user').doc(user.uid).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
                            if (docCount === 0 && snapshot.size === 0) {
                                setCanCreate("true")
                                setSubscriptionType("regular")
                            } else if (docCount != 0 && snapshot.size === 0) {
                                setCanCreate("false")
                                setSubscriptionType("regular")
                            } else {
                                snapshot.forEach(subscription => {
                                    if (subscription.data().status == "active" || subscription.data().status == "trialing") {
                                        if (subscription.data().items[0].plan.id == process.env.REACT_APP_YEARLY) {
                                            setCanCreate("true")
                                            setSubscriptionType("annualPlan")
                                        } else if (subscription.data().items[0].plan.id == process.env.REACT_APP_MONTHLY && docCount <= 4) {
                                            setCanCreate("true")
                                            setChangeSubPlan("true")
                                            setSubscriptionType("monthlyPlan")
                                        } else {
                                            setCanCreate("false")
                                        }
                                    } else if (subscription.data().status == "canceled" || subscription.data().status == "past_due") {
                                        if (docCount === 0) {
                                            setCanCreate("true")
                                            setSubscriptionType("regular")
                                        } else {
                                            setCanCreate("false")
                                            setSubscriptionType("regular")
                                        }
                                    } else {
                                        if (docCount >= 1) {
                                            setCanCreate("false")
                                            setSubscriptionType("regular")
                                        } else {
                                            setCanCreate("true")
                                            setSubscriptionType("regular")
                                        }
                                    }
                                }
                                )
                            }
                            setTimeout(() => {
                                setLoading(false);
                            }, 2000);
                        })
                    })


                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        }
        fetchData();
    }, [user, docCount, subscriptionType]);

    const handleShowUpgradeModal = () => {
        setShowUpgradeModal(true);
    };

    const handleCloseUpgradeModal = () => {
        setShowUpgradeModal(false);
    };

    const handleShowModal = (index) => {
        setShowModal({ toShow: true, index: index });
    };

    const handleCloseModal = () => {
        setShowModal(null);
    };

    const MonthlyPayment = async (priceId) => {
        console.log("xxxx" +process.env.REACT_APP_STRIPE_KEY)
        setUpgradeClick(true)
        setShowUpgradeModal(false);
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection
            ("checkout_sessions").add({
                price: priceId,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
                 trial_period_days: 7,
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
        setUpgradeClick(true)
        setShowUpgradeModal(false);
        if (changeSubPlan) {
            window.open('https://billing.stripe.com/p/login/test_bIYg0M5wa5wZ9xe7ss', '_blank');
        } else {
            const docRef = await dbFirestore.collection('user').doc(user.uid).collection
                ("checkout_sessions").add({
                    price: priceId,
                    success_url: window.location.origin,
                    cancel_url: window.location.origin,
                    trial_period_days: 30,
                    allow_promotion_codes: true,
                    // automatic_tax: true,
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

    const goToEdit = (object) => {

        navigate("/" + currentLanguage + '/folio-form', { state: { object, subscriptionType: subscriptionType } });
    }

    const goToNewForm = () => {
        if (canCreate === "true" && docCount !== null) {
            navigate("/" + currentLanguage + '/folio-form', { state: { subscriptionType: subscriptionType } });
        } else if (canCreate === "false" && docCount !== null) {
            setShowUpgradeModal(true);
        }
    }

    return (
        <>
            {upgradeClick ? (
                <div className='transfering-to-payment'>
                    <h1 className='transfering-to-payment-text'> {t('taking-you-to-the-payment-page')} </h1>
                </div>
            ) : (
                <div>
                    {
                        loading === true ? (
                            // Show loading screen or spinner
                            <div> Loading...</div >
                        ) : (
                            <div>
                                {!profile ?
                                    < Navbar email={" "} isFromForm={"false"} />
                                    :
                                    <div>
                                        < Navbar email={user.email} isFromForm={"false"} />
                                    </div>
                                }

                                <div className='dashboard-view'>
                                    {docCount !== null && canCreate !== null ? (
                                        <div >
                                            <div className='row'>
                                                <div className='col-md-8'>
                                                    <h1 className='dashboard-header'> Your library</h1>
                                                    {docCount === 0 ?
                                                        <h1 className='dashboard-sub-header'>You’re just a few clicks away from creating your first site on Figmafolio.</h1>
                                                        :
                                                        <h1 className='dashboard-sub-header'>{docCount} project</h1>
                                                    }
                                                </div>
                                                <div className='col-md-4 new-site-container'>
                                                        <NewSiteButton className={"new-site"} onClick={goToNewForm}> </NewSiteButton>
                                                    {/* <ButtonColored label={  t('new-site')} className="new-site" onClick={goToNewForm}>
                                                    </ButtonColored> */}
                                                </div>
                                            </div>
                                            {docCount !== 0 ?
                                                <>
                                                    {subscriptionType == "regular" ? (
                                                        <div className='row'>
                                                            {data.map((item, index) => (
                                                                < div className='col-sm-4 folio-container' key={index} style={{ pointerEvents: index != 0 ? 'none' : '' }} >
                                                                    {index == 0 ? (
                                                                        <CardView index={index}
                                                                            subscriptionType={subscriptionType}
                                                                            figmaMobileUrl={item.urls?.figmaMobileUrl}
                                                                            figmaDesktopUrl={item.urls?.figmaDesktopUrl}
                                                                            siteTitle={item?.title}
                                                                            url={item?.generatedUrl}
                                                                            isDraft={item.isDraft}
                                                                            createdAt={item.createdAt}
                                                                            updatedAt={item.updatedAt}
                                                                            onClickDelete={() => handleShowModal(index)}
                                                                            onClickUpdate={() => goToEdit(item)} />

                                                                    ) : (
                                                                        <CardView index={index}
                                                                            subscriptionType={subscriptionType}
                                                                            figmaMobileUrl={item.urls?.figmaMobileUrl}
                                                                            figmaDesktopUrl={item.urls?.figmaDesktopUrl}
                                                                            siteTitle={item?.title}
                                                                            isDraft={item.isDraft}
                                                                            createdAt={item.createdAt}
                                                                            updatedAt={item.updatedAt}
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                            <DeleteModal
                                                                show={showModal}
                                                                handleClose={handleCloseModal}
                                                                id={data[showModal?.index]?.id}
                                                                customDomain={data[showModal?.index]?.customDomain}
                                                                faviconUrl={data[showModal?.index]?.faviconUrl}
                                                            />
                                                        </div>
                                                    ) : subscriptionType == "monthlyPlan" ? (
                                                        <div className='row'>
                                                            {data.map((item, index) => (
                                                                <div className='col-sm-4 folio-container' key={index} style={{ pointerEvents: index > 4 ? 'none' : '' }} >
                                                                    <CardView index={index}
                                                                        subscriptionType={subscriptionType}
                                                                        figmaMobileUrl={item.urls?.figmaMobileUrl}
                                                                        figmaDesktopUrl={item.urls?.figmaDesktopUrl}
                                                                        siteTitle={item?.title}
                                                                        url={item?.generatedUrl}
                                                                        isDraft={item.isDraft}
                                                                        createdAt={item.createdAt}
                                                                        updatedAt={item.updatedAt}
                                                                        onClickDelete={() => handleShowModal(index)}
                                                                        onClickUpdate={() => goToEdit(item)} />
                                                                </div>
                                                            ))}
                                                            <DeleteModal
                                                                show={showModal}
                                                                handleClose={handleCloseModal}
                                                                id={data[showModal?.index]?.id}
                                                                customDomain={data[showModal?.index]?.customDomain}
                                                                faviconUrl={data[showModal?.index]?.faviconUrl}
                                                            />
                                                        </div>
                                                    ) : (

                                                        <div className='row'>
                                                            {data.map((item, index) => (
                                                                < div className='col-sm-4 folio-container' key={index} >
                                                                    <CardView index={index}
                                                                        subscriptionType={subscriptionType}
                                                                        figmaMobileUrl={item.urls?.figmaMobileUrl}
                                                                        figmaDesktopUrl={item.urls?.figmaDesktopUrl}
                                                                        siteTitle={item?.title}
                                                                        url={item?.generatedUrl}
                                                                        isDraft={item.isDraft}
                                                                        createdAt={item.createdAt}
                                                                        updatedAt={item.updatedAt}
                                                                        onClickDelete={() => handleShowModal(index)}
                                                                        onClickUpdate={() => goToEdit(item)} />
                                                                </div>
                                                            ))}
                                                            <DeleteModal
                                                                show={showModal}
                                                                handleClose={handleCloseModal}
                                                                id={data[showModal?.index]?.id}
                                                                customDomain={data[showModal?.index]?.customDomain}
                                                                faviconUrl={data[showModal?.index]?.faviconUrl}
                                                            />
                                                        </div>
                                                    )}
                                                </>
                                                :
                                                <EmptyCardView goToNewForm={goToNewForm} />


                                            }

                                        </div >
                                    ) : (<div> </div>)

                                    }
                                </div>
                                <Footer />
                            </div >
                        )
                    }
                </div>
            )}

            <PaymentSelectionModal
                monthlySubscription={subscriptionType}
                show={showUpgradeModal}
                handleClose={handleCloseUpgradeModal}
                handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_MONTHLY)}
                handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_YEARLY)} />

        </>
    );
}

export default UserDashboard;


