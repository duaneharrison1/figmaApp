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
import PaymentSelectionLite from '../../components/PaymentSelection/PaymentSelectionLite';

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
    const [canCreate, setCanCreate] = useState({
        figma: false,
        html: false,

    });
    const [docCount, setDocCount] = useState(null)
    const [trialConsume, setTrialConsume] = useState(null)
    const [subscriptionType, setSubscriptionType] = useState("")
    const [changeSubPlan, setChangeSubPlan] = useState(null)
    const dbFirestore = firebase.firestore();
    const [loading, setLoading] = useState(true);
    const [siteCounts, setSiteCounts] = useState({
        figma: 0,
        html: 0,
    });

    useEffect(() => {
        if (subscriptionType === "regular") {
            setCanCreate({
                figma: siteCounts.figma < 1,
                html: siteCounts.html < 1,
            });
        } else if (subscriptionType === "monthlyPlan" || subscriptionType === "annualPlan") {
            setCanCreate({
                figma: true,
                html: true,
            });
        }
    }, [subscriptionType, siteCounts]);

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
        const fetchData = async () => {
            if (user) {
                try {
                    console.log("deployedxxxx")
                    dbFirestore.collection("user").doc(user.uid).collection("url").orderBy('createdAt', 'desc').get().then(querySnapshot => {
                        const newData = querySnapshot.docs.map((doc) => ({
                             ...doc.data(), 
                             id: doc.id,
                             siteType: doc.data().siteType || "figma" }));

                             const figmaCount = newData.filter((site) => site.siteType === "figma").length;
                             const htmlCount = newData.filter((site) => site.siteType === "html").length;

                        setData(newData);
                        setDocCount(querySnapshot.size)
                        setSiteCounts({figma: figmaCount,
                                       html: htmlCount
                        })

                        //Fetch Subscription Data
                        dbFirestore.collection('user').doc(user.uid).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
                            let canCreateFigma = false;
                            let canCreateHtml = false;
                            let subscriptionType = "regular";
                        
                            if (snapshot.size === 0) {
                                // Free user (no subscription)
                                canCreateFigma = figmaCount < 1;
                                canCreateHtml = htmlCount < 1;
                            } else {
                                const subscription = snapshot.docs[0].data();
                                const planId = subscription.items[0].plan.id;
                                const isActive = subscription.status === "active" || subscription.status === "trialing";
                                const isCanceled = subscription.status === "canceled" || subscription.status === "past_due";
                        
                                if (isActive) {
                                    if (planId === process.env.REACT_APP_PRO || planId === process.env.REACT_APP_YEARLY) {
                                        // Pro or annual plan: Allow unlimited sites
                                        canCreateFigma = true;
                                        canCreateHtml = true;
                                        subscriptionType = "annualPlan";
                                    } else if (planId === process.env.REACT_APP_BASIC || planId === process.env.REACT_APP_MONTHLY) {
                                        // Basic or monthly plan: Allow one Figma site and one HTML site
                                        canCreateFigma = figmaCount < 1;
                                        canCreateHtml = htmlCount < 1;
                                        subscriptionType = "monthlyPlan";
                                    }
                                } else if (isCanceled) {
                                    // Subscription canceled or past due: Treat as free user
                                    setTrialConsume("true");
                                    canCreateFigma = figmaCount < 1;
                                    canCreateHtml = htmlCount < 1;
                                }
                            }
                        
                            // Default case for free users
                            if (subscriptionType === "regular") {
                                canCreateFigma = figmaCount < 1;
                                canCreateHtml = htmlCount < 1;
                            }
                        
                            // Update state
                            setCanCreate({ figma: canCreateFigma, html: canCreateHtml });
                            setSubscriptionType(subscriptionType);
                        
                            setTimeout(() => {
                                setLoading(false);
                            }, 2000);
                        })


                        dbFirestore.collection('user').doc(user.uid).collection("payments").orderBy('created', 'desc').limit(1).get().then(snapshot => {
                            if (docCount !== 0 && snapshot.size !== 0) {
                                setSubscriptionType("liteUser")
                                console.log("wentHere lite user")
                            }
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
    const litePayment = async (priceId) => {
        setUpgradeClick(true)
        const docRef = await dbFirestore.collection('user').doc(user.uid).collection
            ("checkout_sessions").add({
                price: priceId,
                mode: 'payment',
                quantity: 1,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
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

    const MonthlyPayment = async (priceId) => {
        console.log("xxxx" + process.env.REACT_APP_STRIPE_KEY)
        setUpgradeClick(true)
        setShowUpgradeModal(false);
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
        setUpgradeClick(true)
        setShowUpgradeModal(false);
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

    const goToEdit = (object) => {
        navigate("/" + currentLanguage + '/folio-form', { state: { object, subscriptionType: subscriptionType, trialConsume: trialConsume } });
    }

    const goToNewForm = () => {
        if (canCreate === "true" && docCount !== null) {
            navigate("/" + currentLanguage + '/folio-form', { state: { subscriptionType: subscriptionType, trialConsume: trialConsume } });
        } else if (canCreate === "false" && docCount !== null) {
            setShowUpgradeModal(true);
        }
    }

    const handleNewSiteClick = (siteType) => {
        if (canCreate[siteType]) {

            dbFirestore.collection("user").doc(user.uid).collection("url").add({
                siteType: siteType, 
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),})
            console.log(`Creating a new ${siteType} site`);
            navigate("/" + currentLanguage + "/folio-form", { state: { siteType, subscriptionType, trialConsume } });
        } else {
            alert(`You have reached the limit for ${siteType} sites.`);
            showUpgradeModal(true);
        }
    };
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
                                                    <NewSiteButton className={"new-site"} onClick={handleNewSiteClick} canCreate={canCreate}> </NewSiteButton>
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
                                                                            password={item.password}
                                                                            isPasswordActive={item.isPasswordActive}
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
                                                                    <CardView
                                                                        index={index}
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
                                                                    <CardView
                                                                        index={index}
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


            {subscriptionType === "liteUser" ?

                <PaymentSelectionModal
                    monthlySubscription={subscriptionType}
                    show={showUpgradeModal}
                    handleClose={handleCloseUpgradeModal}
                    handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_BASIC)}
                    handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_PRO)} />

                :
                <PaymentSelectionLite show={showUpgradeModal} handleClose={handleCloseUpgradeModal}
                    handleLitePayment={() => litePayment(process.env.REACT_APP_LITE)}
                    handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_BASIC)}
                    handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_PRO)} />


            }
        </>
    );
}

export default UserDashboard;


