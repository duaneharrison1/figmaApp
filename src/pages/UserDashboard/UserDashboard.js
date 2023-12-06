import React from 'react';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import { signOut } from "firebase/auth";
import firebase from '../../firebase';
import CardView from '../../components/CardView/CardView';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import './UserDashboard.css';
import Navbar from '../../components/NavBar/Navbar';
import { loadStripe } from '@stripe/stripe-js';
import { format } from 'date-fns';
import UpgradeAlertModal from '../../components/UpgradeAlert/UpgradeAlertModal';
import PaymentSelectionModal from '../../components/PaymentSelection/PaymentSelection';
function UserDashboard() {
    const [userIsDesktop, setUserIsDesktop] = useState(true);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [profile, setProfile] = useState([]);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [canCreate, setCanCreate] = useState(true);
    const [docCount, setDocCount] = useState(null)
    const [subscriptionType, setSubscriptionType] = useState("")
    const [subscriptionStatus, setSubscriptionStatus] = useState(null)
    const [changeSubPlan, setChangeSubPlan] = useState(null)
    const dbFirestore = firebase.firestore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.innerWidth > 1280 ? setUserIsDesktop(true) : setUserIsDesktop(false);
    }, [userIsDesktop]);

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
                        }).then(
                            await getDocs(collection(db, "user", user.uid, "url"))
                                .then((querySnapshot) => {
                                    const newData = querySnapshot.docs
                                        .map((doc) => ({ ...doc.data(), id: doc.id }));
                                    setData(newData);
                                    setDocCount(querySnapshot.size)

                                    console.log(user.uid)
                                })
                        ).then(
                            dbFirestore.collection('customers').doc(user.uid).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
                                if (snapshot.empty) {
                                    if (docCount >= 1) {
                                        setCanCreate(false)
                                        setSubscriptionType("regular")
                                    }
                                } else {
                                    snapshot.forEach(async subscription => {
                                        if (subscription.data().status == "active") {
                                            if (subscription.data().items[0].plan.id == "price_1OJSsDJyvkMmBNuRwxFTCnhQ") {
                                                setCanCreate(true)
                                                setSubscriptionType("annualPlan")
                                            } else if (subscription.data().items[0].plan.id == process.env.stripe.MONTHLY && docCount <= 4) {
                                                setCanCreate(true)
                                                setChangeSubPlan(true)
                                                setSubscriptionType("monthlyPlan")
                                            } else {
                                                setCanCreate(false)
                                            }
                                        } else if (subscription.data().status == "canceled") {
                                            if (docCount >= 1) {
                                                setCanCreate(false)
                                                setSubscriptionType("regular")
                                                console.log("wentHere0")
                                            } else {
                                                setCanCreate(true)
                                                setSubscriptionType("regular")
                                            }
                                        } else {
                                            if (docCount >= 1) {
                                                setCanCreate(false)
                                                setSubscriptionType("regular")
                                            } else {
                                                setCanCreate(true)
                                                setSubscriptionType("regular")
                                            }
                                        }
                                    })
                                }
                            })
                        )
                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false);
                }
            }
            else {
                console.log('No user data available');
            }
        };
        fetchData();
    }, [user, profile]);

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
        console.log("hhh" + process.env.REACT_APP_MONTHLY)
        const docRef = await dbFirestore.collection('customers').doc(user.uid).collection
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
            window.open('https://billing.stripe.com/p/login/test_bIYg0M5wa5wZ9xe7ss', '_blank');
        } else {
            const docRef = await dbFirestore.collection('customers').doc(user.uid).collection
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




    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    const goToEdit = (object, profile) => {
        navigate('/editform', { state: { object, profile, subscriptionType: subscriptionType } });
    }

    const goToNewForm = () => {
        navigate('/form', { state: { subscriptionType: subscriptionType } });
        // navigate('/form', {state: {profile} });


    }

    return (
        <>
            {loading ? (
                // Show loading screen or spinner
                <div>Loading...</div>
            ) : (
                <div>
                    {process.env.REACT_APP_MONTHLY}
                    {!profile ?
                        < Navbar className={"dashboardNavBar"} email={" "} onClickLogout={handleLogout} isFromForm={false} />
                        :
                        <div>
                            {profile.map(profile => (
                                < Navbar className={"dashboardNavBar"} email={profile.name} onClickLogout={handleLogout} isFromForm={false} />
                            ))}
                        </div>
                    }

                    <a href="https://billing.stripe.com/p/login/test_bIYg0M5wa5wZ9xe7ss" className="button">Test unsubscribe</a>
                    <div className='dashboard-view'>
                        <div>
                            {!canCreate ?
                                <ButtonColored label='Monthly subscription exceeds number of apps' className="new-site" onClick={handleShowUpgradeModal}>
                                </ButtonColored>
                                :
                                <ButtonColored label='+ New site' className="new-site" onClick={goToNewForm}>
                                </ButtonColored>
                            }


                        </div>

                        {subscriptionType == "regular" ? (
                            <div className='row'>
                                {data.map((item, index) => (
                                    < div className='col-sm-4' key={index} style={{ pointerEvents: index != 0 ? 'none' : '' }} >
                                        <CardView index={index} subscriptionType={subscriptionType} figmaMobileUrl={item.urls?.figmaMobileUrl} figmaDesktopUrl={item.urls?.figmaDesktopUrl} siteTitle={item?.title} url={item?.generatedUrl} isDraft={item.isDraft} onClickDelete={handleShowModal} onClickUpdate={() => goToEdit(item, profile)} />
                                        <DeleteModal show={showModal} handleClose={handleCloseModal} id={item.id} generatedUrl={item.generatedUrl} />
                                    </div>
                                ))}
                            </div>
                        ) : subscriptionType == "pro" ? (
                            <div className='row'>
                                {data.map((item, index) => (
                                    < div className='col-sm-4' key={index} style={{ pointerEvents: index <= 4 ? '' : 'none' }} >
                                        <CardView index={index} subscriptionType={subscriptionType} figmaMobileUrl={item.urls?.figmaMobileUrl} figmaDesktopUrl={item.urls?.figmaDesktopUrl} siteTitle={item?.title} url={item?.generatedUrl} isDraft={item.isDraft} onClickDelete={handleShowModal} onClickUpdate={() => goToEdit(item, profile)} />
                                        <DeleteModal show={showModal} handleClose={handleCloseModal} id={item.id} generatedUrl={item.generatedUrl} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='row'>
                                {data.map((item, index) => (
                                    < div className='col-sm-4' key={index} >
                                        <CardView index={index} subscriptionType={subscriptionType} figmaMobileUrl={item.urls?.figmaMobileUrl} figmaDesktopUrl={item.urls?.figmaDesktopUrl} siteTitle={item?.title} url={item?.generatedUrl} isDraft={item.isDraft} onClickDelete={handleShowModal} onClickUpdate={() => goToEdit(item, profile)} />
                                        <DeleteModal show={showModal} handleClose={handleCloseModal} id={item.id} generatedUrl={item.generatedUrl} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div >
                </div >
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


