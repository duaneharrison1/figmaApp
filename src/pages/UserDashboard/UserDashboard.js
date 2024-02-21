import React from 'react';
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore'
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

function UserDashboard() {
    const [userIsDesktop, setUserIsDesktop] = useState(true);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [profile, setProfile] = useState([]);
    const [upgradeClick, setUpgradeClick] = useState(false);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [canCreate, setCanCreate] = useState(null);
    const [docCount, setDocCount] = useState(null)
    const [subscriptionType, setSubscriptionType] = useState("")
    const [changeSubPlan, setChangeSubPlan] = useState(null)
    const dbFirestore = firebase.firestore();
    const [loading, setLoading] = useState(true);


    // useEffect(() => {
    //     let link = document.querySelector("link[rel~='icon']");
    //     if (!link) {
    //         link = document.createElement('link');
    //         link.rel = 'icon';
    //         document.getElementsByTagName('head')[0].appendChild(link);
    //     }
    //     link.href = 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico?v=ec617d715196';
    // }, []);



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
                    getDocs(collection(db, "user", user.uid, "url")).then((querySnapshot) => {
                        const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                        setData(newData);
                        setDocCount(querySnapshot.size)
                        dbFirestore.collection('user').doc(user.uid).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
                            if (docCount === 0) {
                                setCanCreate("true")
                                setSubscriptionType("regular")
                            } else {
                                if (snapshot.size === 0) {
                                    setCanCreate("false")
                                } else {
                                    snapshot.forEach(subscription => {
                                        if (subscription.data().status == "active") {
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
                                        } else if (subscription.data().status == "canceled") {
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
                            }
                        })
                    })
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false)
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

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const MonthlyPayment = async (priceId) => {
        setUpgradeClick(true)
        setShowUpgradeModal(false);
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
        setUpgradeClick(true)
        setShowUpgradeModal(false);
        if (changeSubPlan) {
            window.open('https://billing.stripe.com/p/login/test_bIYg0M5wa5wZ9xe7ss', '_blank');
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

    const goToEdit = (object) => {
        navigate('/editform', { state: { object, subscriptionType: subscriptionType } });
    }

    const goToNewForm = () => {
        if (canCreate === "true" && docCount !== null) {
            navigate('/form', { state: { subscriptionType: subscriptionType } });
        } else if (canCreate === "false" && docCount !== null) {
            setShowUpgradeModal(true);
        }
    }

    return (
        <>
            {upgradeClick ? (
                <div className='transfering-to-payment'>
                    <h1 className='transfering-to-payment-text'> Taking you to the payment page...</h1>
                </div>
            ) : (
                <div>
                    {
                        loading == true ? (
                            // Show loading screen or spinner
                            <div> Loading...</div >
                        ) : (
                            <div>
                                {!profile ?
                                    < Navbar className={"dashboardNavBar"} email={" "} isFromForm={"false"} />
                                    :
                                    <div>
                                        < Navbar className={"dashboardNavBar"} email={user.email} isFromForm={"false"} />
                                        {/* {profile.map(profile => (
                                            < Navbar className={"dashboardNavBar"} email={profile.name} isFromForm={"false"} />
                                        ))} */}
                                    </div>
                                }

                                {/* <a href="https://billing.stripe.com/p/login/test_bIYg0M5wa5wZ9xe7ss" className="button">Test unsubscribe</a> */}


                                <div className='dashboard-view'>
                                    {docCount !== null && canCreate !== null ? (

                                        <div >


                                            <ButtonColored label='+ New site' className="new-site" onClick={goToNewForm}>
                                            </ButtonColored>




                                            {subscriptionType == "regular" ? (
                                                <div className='row'>
                                                    {data.map((item, index) => (
                                                        < div className='col-sm-4' key={index} style={{ pointerEvents: index != 0 ? 'none' : '' }} >
                                                            <CardView index={index} subscriptionType={subscriptionType} figmaMobileUrl={item.urls?.figmaMobileUrl} figmaDesktopUrl={item.urls?.figmaDesktopUrl} siteTitle={item?.title} url={item?.generatedUrl} isDraft={item.isDraft} onClickDelete={handleShowModal} onClickUpdate={() => goToEdit(item)} />
                                                            <DeleteModal show={showModal} handleClose={handleCloseModal} id={item.id} generatedUrl={item.generatedUrl} customDomain={item.customDomain} />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : subscriptionType == "monthlyPlan" ? (
                                                <div className='row'>
                                                    {data.map((item, index) => (
                                                        < div className='col-sm-4' key={index} style={{ pointerEvents: index <= 4 ? '' : 'none' }} >
                                                            <CardView index={index} subscriptionType={subscriptionType} figmaMobileUrl={item.urls?.figmaMobileUrl} figmaDesktopUrl={item.urls?.figmaDesktopUrl} siteTitle={item?.title} url={item?.generatedUrl} isDraft={item.isDraft} onClickDelete={handleShowModal} onClickUpdate={() => goToEdit(item)} />
                                                            <DeleteModal show={showModal} handleClose={handleCloseModal} id={item.id} generatedUrl={item.generatedUrl} customDomain={item.customDomain} />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className='row'>
                                                    {data.map((item, index) => (
                                                        < div className='col-sm-4' key={index} >
                                                            <CardView index={index} subscriptionType={subscriptionType} figmaMobileUrl={item.urls?.figmaMobileUrl} figmaDesktopUrl={item.urls?.figmaDesktopUrl} siteTitle={item?.title} url={item?.generatedUrl} isDraft={item.isDraft} onClickDelete={handleShowModal} onClickUpdate={() => goToEdit(item)} />
                                                            <DeleteModal show={showModal} handleClose={handleCloseModal} id={item.id} generatedUrl={item.generatedUrl} customDomain={item.customDomain} />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
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


