import React from 'react';
import { useState, useEffect } from 'react';
import './Footer.css';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();
    const [userIsDesktop, setUserIsDesktop] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        window.innerWidth > 1280 ? setUserIsDesktop(true) : setUserIsDesktop(false);
    }, [userIsDesktop]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const goToTermsAndConditions = () => {
        navigate('/terms-and-conditions');
    }
    const goToPrivacyPolicy = () => {
        navigate('/privacy-policy');
    }

    return (
        <>
            {!userIsDesktop ? (
                <footer className="footer">
                    <div className="container-fluid main-footer-container">
                        <div className="row">
                            <div className="col-md-4">
                                <h1 className='footer-figmafolio'> Figmafolio</h1>
                            </div>
                            <div className="col-md-4">
                                <div className="flex-container footer-item">
                                    <h1 className='footer-center' onClick={goToTermsAndConditions}> Terms and Conditions</h1>
                                    <h1 className='footer-center' onClick={goToPrivacyPolicy}> Provicy Policy</h1>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="email-support-container col-md-4">
                                    {user ? <p> <a className="email-support-link" href="mailto:support@figmafolio.com">support@figmafolio.com</a>
                                    </p> : <p> </p>}

                                </div>
                            </div>

                        </div>
                    </div>
                </footer>
            ) : (
                <footer className="footer">
                    <div className="container-fluid main-footer-container">
                        <div className="row row-container">
                            <div className="col-md-4">
                                <h1 className='footer-figmafolio'> Figmafolio</h1>
                            </div>
                            <div className="col-md-4">
                                <div className="flex-container footer-item">
                                    <h1 className='footer-center' onClick={goToTermsAndConditions}> Terms and Conditions</h1>
                                    <h1 className='footer-center' onClick={goToPrivacyPolicy}> Provicy Policy</h1>
                                </div>
                            </div>
                            <div className="email-support-container col-md-4">
                                {user ? <p> <a className="email-support-link" href="mailto:support@figmafolio.com">support@figmafolio.com</a>
                                </p> : <p> </p>}
                            </div>

                        </div>
                    </div>
                </footer>
            )}
        </>


    )
}