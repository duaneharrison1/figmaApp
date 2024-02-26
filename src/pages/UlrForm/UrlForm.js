import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc, query, where } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import firebase from '../../firebase';
import { signOut } from "firebase/auth";
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import './UrlForm.css';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import Navbar from '../../components/NavBar/Navbar';
import PaymentSelectionModal from '../../components/PaymentSelection/PaymentSelection';
import { loadStripe } from '@stripe/stripe-js';
import AlertErrorModal from '../../components/AlertErrorModal/AlertErrorModal';
import insOne from './../../assets/images/ins-1.png';
import insTwo from './../../assets/images/ins-2.png';
import insThree from './../../assets/images/ins-3.png';
import insFour from './../../assets/images/ins-4.png';

export default function UrlForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [figmaDesktopUrl, setDesktopCustomUrl] = useState('');
    const [figmaMobileUrl, setfigmaMobileUrl] = useState('');
    const [title, setTitle] = useState('');
    const [domain, setDomain] = useState('');
    const user = auth.currentUser;
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const dbFirestore = firebase.firestore();
    const [subscriptionType, setSubscriptionType] = useState(location.state.subscriptionType);


    const handleShowModal = () => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowErrorModal = () => {
        setShowErrorModal(true);
    };
    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
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
    const handleDomain = (event) => {
        setDomain(event.target.value);
    };

    const goToPreview = () => {

        if (figmaMobileUrl.includes('figma.com/proto') || figmaMobileUrl.includes('figma.com/embed') ||
            figmaDesktopUrl.includes('figma.com/proto') || figmaDesktopUrl.includes('figma.com/embed')) {
            navigate('/preview', { state: { title: title, figmaMobileUrl: figmaMobileUrl, figmaDesktopUrl: figmaDesktopUrl, domain: domain } });
        } else {
            setShowErrorModal(true);
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
    return (
        <>
            <Navbar className={"dashboardNavBar"} email={user.email} onClickLogout={handleLogout} isFromForm={"newForm"} />

            <div className='form'>
                <div className="url-form">

                    <div className='form-container'>
                        <div className='row first-div'>
                            <h1 className='form-title'>General</h1>
                            <div className='col-md-6'>
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
                                <p>This will be assigned after clicking ‘Publish’.</p>
                            </div>
                            <div className='col-md-6'>
                                <h2 className='form-sub-header'>Custom domain</h2>


                                {subscriptionType == "regular" ?
                                    (
                                        <div>
                                            <p className='note'> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#424242" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" />
                                            </svg> You have to upgrade account to have Custom domain</p>
                                            <ButtonClear label='Upgrade account' className="upgrade-plan" onClick={handleShowModal} />
                                        </div>
                                    ) : (

                                        <div>
                                            <input
                                                className='input'
                                                type="text"
                                                placeholder='Enter your domain'
                                                value={domain}
                                                onChange={handleDomain} />

                                            <div className='domain-info'>
                                                <p className='domain-info-header'>To use a custom domain name, add new DNS records in your domain registrar's DNS manager. Add the following records:</p>
                                                <table className='domain-info-table'>
                                                    <tr className='domain-info-subheader'>
                                                        <th>Type</th>
                                                        <th>Name</th>
                                                        <th>Value</th>
                                                    </tr>
                                                    <tr className='domain-info-one'>
                                                        <td>A</td>
                                                        <td>@</td>
                                                        <td>76.76.21.21</td>
                                                    </tr>
                                                    <tr className='domain-info-one'>
                                                        <td>CNAME</td>
                                                        <td>www</td>
                                                        <td>cname.vercel-dns.com</td>
                                                    </tr>
                                                </table>
                                                <p className='domain-info-header'> Make sure you add an entry for both @ and www.</p>
                                            </div>
                                        </div>
                                    )}


                                {/* {Object.entries(products).map(([productId, productData]) => {
                                    return (
                                        <div className="plans" key={productId}>
                                            <div> {productData.name}</div>

                                            <button onClick={() => checkout("price_1OCDfLJyvkMmBNuRrErMN5YD")}>Subscribe</button>
                                        </div>

                                    )
                                })} */}
                            </div>
                        </div>


                        {/* <div className='second-div'>
                            <h1 className='form-title'>Figma prototype links</h1>

                            <p className='note'> Paste in the links of your desktop and mobile prototypes below to have them create your Figmafolio site. By adding separate desktop and mobile links, all viewers can easily preview your work on any device. We'll detect the device and load the appropriate prototype</p>
                            <p className='note'> Here are some tips: </p>
                            <ul className='instruction'>
                                <li className='note'>Paste in the link to a prototype or specific prototype flow, not the full Figma file</li>
                                <li className='note'>If you do not have a separate mobile prototype, you can paste in the desktop prototype link to show the desktop view on mobile.</li>
                                <li className='note'>For best results, match prototype’s background colour to your sites background colour in Figma in prototype settings.</li>
                            </ul>
                        </div> */}

                        <div className="fifth-div">
                            <h1 className='sub-title'>Figma prototype links</h1>
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

                        <div className='preview-btn-container'>
                            <ButtonColored className="preview-btn" label="Preview" onClick={goToPreview} />
                        </div>
                        <div className='second-div'>
                            <h1 className='sub-title'>Need help setting up your site?</h1>
                            <div className='row instruction-div'>
                                <div className="col-sm-3">
                                    <div className='div-instruction-img'>
                                        <img src={insOne} className='instruction-img' />
                                    </div>
                                    <h1 className='instruction-title'>Design in Figma</h1>
                                    <p className='instructions'>1. Open Figma and design each page of your portfolio or website</p>
                                    <p className='instructions'> Note: It is recommended to create separate designs for both desktop and mobile pages.</p>
                                </div>
                                <div className="col-sm-3">
                                    <div className='div-instruction-img'>
                                        <img src={insTwo} className='instruction-img' />
                                    </div>
                                    <h1 className='instruction-title'>Prototype in Figma</h1>
                                    <p className='instructions'>1. Switch to "Prototype" mode in the right sidebar.</p>
                                    <p className='instructions'>2. Draw connections between pages to define the navigation of your site.</p>
                                    <p className='instructions'>3. Ideally create two flows: one for desktop and one for mobile. </p>
                                    <p className='instructions'> Note: You can add animations to connections to enhance any transitions.</p>
                                </div>
                                <div className="col-sm-3">
                                    <div className='div-instruction-img'>
                                        <img src={insThree} className='instruction-img' />
                                    </div>
                                    <h1 className='instruction-title'>Set flow starting points</h1>
                                    <p className='instructions'>1. For your desktop prototype, select the frame users will see. Typically the homepage.</p>
                                    <p className='instructions'>2. In the right sidebar under Prototype, click the ‘+’ next to ‘Flow starting point’ to set the flow starting point. </p>
                                    <p className='instructions'>3. Repeat for your mobile prototype if you have one. </p>
                                </div>
                                <div className="col-sm-3">
                                    <div className='div-instruction-img'>
                                        <img src={insFour} className='instruction-img' />
                                    </div>

                                    <h1 className='instruction-title'>Input your prototype links</h1>
                                    <p className='instructions'>1. Click the canvas in Figma to get  file properties in the right sidebar.</p>
                                    <p className='instructions'>2. Select ‘Prototype’. Under ‘Flows’ .hover over each flow and "Copy link" to get the prototype links. </p>
                                    <p className='instructions'>3. Paste in the corresponding prototype links below. </p>
                                    <p className='instructions'>4. Click "Preview" to view and publish your portfolio/site. </p>
                                    <p className='instructions'>Note: If you only provide one prototype link, Figmafolio will show that flow on both desktop and mobile.</p>
                                </div>
                            </div>
                        </div>
                    </div>




                </div>
                <PaymentSelectionModal show={showModal} handleClose={handleCloseModal}
                    handleMonthlyPayment={() => MonthlyPayment(process.env.REACT_APP_MONTHLY)}
                    handleYearlyPayment={() => yearlyPayment(process.env.REACT_APP_YEARLY)} />

                < AlertErrorModal show={showErrorModal} handleClose={handleCloseErrorModal} alertMessage={"You have entered a link to a Figma file. To publish your Figmafolio website, you must enter a link to a Figma prototype. Prototypes allow visitors to interact with your site."} />
            </div>
        </>

    );
};

