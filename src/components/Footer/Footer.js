import React from 'react';
import { useState, useEffect } from 'react';
import './Footer.css';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

export default function Footer() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [userIsDesktop, setUserIsDesktop] = useState(true);
    const [user, setUser] = useState(null);
    const lng = navigator.language;
    useEffect(() => {
        i18n.changeLanguage(lng);
    }, [])

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
                                    <h1 className='footer-center' onClick={goToTermsAndConditions}> {t('terms-and-conditions')}</h1>
                                    <h1 className='footer-center' onClick={goToPrivacyPolicy}> {t('privacy-policy')}</h1>
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
                                    <h1 className='footer-center' onClick={goToPrivacyPolicy}> Privacy Policy</h1>
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