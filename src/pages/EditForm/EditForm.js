import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { useNavigate, NavLink, useParams, useLocation } from 'react-router-dom';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { loadStripe } from '@stripe/stripe-js';
import { signOut } from "firebase/auth";
import './EditForm.css';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import Navbar from '../../components/NavBar/Navbar';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import PaymentSelectionModal from '../../components/PaymentSelection/PaymentSelection';
import axios from "axios";
export default function EditForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [figmaDesktopUrl, setDesktopCustomUrl] = useState(location.state.object.urls.figmaDesktopUrl);
    const [figmaMobileUrl, setfigmaMobileUrl] = useState(location.state.object.urls.figmaMobileUrl);
    const [profile, setProfile] = useState(location.state.profile);
    const [generatedUrl, setgeneratedUrl] = useState(location.state.object.generatedUrl);
    const [title, setTitle] = useState(location.state.object.title);
    const [customDomain, setCustomDomain] = useState(location.state.object.customDomain);
    const [newCustomDomain, setNewCustomDomain] = useState(location.state.object.customDomain);
    const user = auth.currentUser;
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [products, setProducts] = useState([])
    const dbFirestore = firebase.firestore();

    useEffect(() => {
        dbFirestore.collection('products').where('active', '==', true).get().then(snapshot => {
            const products = {}
            snapshot.forEach(async productDoc => {
                products[productDoc.id] = productDoc.data()
                setProducts(products)

                const priceSnapshot = await productDoc.ref.collection('prices').get();
                priceSnapshot.forEach(priceDoc => {
                    products[productDoc.id].prices = {
                        priceId: priceDoc.id,
                        priceData: priceDoc.data()
                    }
                })
            })
        })

    });


    const goToPreview = () => {
        navigate('/preview', { state: { title: title, figmaMobileUrl: figmaMobileUrl, figmaDesktopUrl: figmaDesktopUrl, fromEdit: true, isDraft: location.state.object.isDraft, docId: location.state.object.id, generatedUrl: generatedUrl, domain: customDomain, newCustomDomain: newCustomDomain } });
    }



    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };




    const handlefigmaDesktopUrl = (event) => {
        setDesktopCustomUrl(event.target.value);
    };
    const handlefigmaMobileUrl = (event) => {
        setfigmaMobileUrl(event.target.value);
    };

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const handleCustomDomain = (event) => {
        setNewCustomDomain(event.target.value);
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    const MonthlyPayment = async (priceId) => {
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

    const handleUpdateDomain = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 83YzDqNvO4OoVtKXQXJ4mTyj'
            };

            const response = await axios.delete(`https://api.vercel.com/v9/projects/prj_Ng7WpEWng5RoiFDPqrrEIT54ksIa/domains/${customDomain}?teamId=team_KEHIxRRKOUxKfN9ICKr5A2XQ`,
                {
                    headers: headers,
                }).then((response) => {
                    alert("successful removing ")
                }).catch((error) => {
                    alert(error)
                    console.log(error.response.data.error)
                });
        } catch (error) {
            alert(error)
        }
    }
    return (
        <>
            {!profile ?
                < Navbar className={"dashboardNavBar"} email={" "} onClickLogout={handleLogout} isFromForm={true} />
                :
                <div>
                    {profile.map(profile => (
                        < Navbar className={"dashboardNavBar"} email={profile.name} onClickLogout={handleLogout} isFromForm={true} />
                    ))}
                </div>
            }

            <div className='form'>
                <div className="url-form">

                    <div className='form-container'>
                        <div className='row first-div'>
                            <div className='col-md-6'>
                                <h1 className='form-title'>General</h1>
                                <h2 className='form-sub-header'>Title</h2>
                                <input
                                    className='input'
                                    type="text"
                                    placeholder='Enter your site name'
                                    value={title}
                                    onChange={handleTitle} />
                            </div>
                            <div className='col-md-6'></div>
                        </div>

                        <div className='row second-div'>
                            <div className='col-6 align-items-start'>
                                <h1 className='form-sub-header'>Your domain</h1>
                                <p> figmafolio.com/{generatedUrl} </p>
                            </div>
                            <div className='col-md-6'>
                                <h2 className='form-sub-header'>Custom domain</h2>

                                <input
                                    className='input'
                                    type="text"
                                    placeholder='Enter your domain'
                                    value={newCustomDomain}
                                    onChange={handleCustomDomain}
                                />


                                <ButtonClear label='Remove/Update domain' className="upgrade-plan" onClick={handleUpdateDomain} />

                            </div>
                        </div>


                        <div className='second-div'>
                            <h1 className='form-title'>Figma prototype links</h1>
                            {/* <p className='note'> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#424242" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" />
                                </svg> You should hide hide hotspot hints by selecting the Options menu in the prototype of Figma for a better experience</p> */}
                            <p className='note'> Paste in the links of your desktop and mobile prototypes below to have them create your Figmafolio site. By adding separate desktop and mobile links, all viewers can easily preview your work on any device. We'll detect the device and load the appropriate prototype</p>
                            <p className='note'> Here are some tips: </p>
                            <ul className='instruction'>
                                <li className='note'>Paste in the link to a prototype or specific prototype flow, not the full Figma file</li>
                                <li className='note'>If you do not have a separate mobile prototype, you can paste in the desktop prototype link to show the desktop view on mobile.</li>
                                <li className='note'>For best results, match prototype’s background colour to your sites background colour in Figma in prototype settings.</li>
                            </ul>
                        </div>

                        <div className="fifth-div">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="row">
                                        <h2 className='form-sub-header'>
                                            Desktop prototype link
                                        </h2>
                                        <div>
                                            <input
                                                className='form-input'
                                                type="text"
                                                placeholder='Custom Desktop Url'
                                                value={figmaDesktopUrl}
                                                onChange={handlefigmaDesktopUrl}
                                            />
                                        </div>

                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="row">
                                        <h2 className='form-sub-header'>
                                            Mobile prototype link
                                        </h2>
                                        <div>
                                            <input
                                                className='form-input'
                                                type="text"
                                                placeholder='Custom Mobile Url'
                                                value={figmaMobileUrl}
                                                onChange={handlefigmaMobileUrl}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='preview-btn-container'>
                        <ButtonColored className="preview-btn" label="Preview" onClick={goToPreview} />
                    </div>

                    <PaymentSelectionModal show={showModal} handleClose={handleCloseModal}
                        handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_MONTHLY)}
                        handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_YEARLY)} />
                </div>
            </div>

        </>
    );
};

