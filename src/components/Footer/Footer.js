import React, { useState, useEffect } from 'react';
import './Footer.css';
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

export default function Footer() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const lng = navigator.language;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const goToTermsAndConditions = () => {
        navigate('/terms-and-conditions');
    };

    const goToPrivacyPolicy = () => {
        navigate('/privacy-policy');
    };

    return (
        <footer className="footer">
            <div className="container-fluid main-footer-container p-0">
                <div className="flex-container footer-item">
                    <div className="footer-left-item">
                        <p className="footer-center" onClick={goToTermsAndConditions}>
                            {t('terms-and-conditions')}
                        </p>
                        <p className="footer-center" onClick={goToPrivacyPolicy}>
                            {t('privacy-policy')}
                        </p>
                    </div>
                    {user && (
                        <p>
                            <a className="email-support-link" href="mailto:support@figmafolio.com">
                                support@figmafolio.com
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </footer>
    );
}
