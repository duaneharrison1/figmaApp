import React from 'react';
import { useState, useEffect } from 'react';
import './Footer.css';
import SocialMediaIcons from '../SocialMediaIcon/SocialMediaIcon';
import { auth } from '../../firebase';

export default function Footer() {
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
                                    <h1 className='footer-center'> Terms</h1>
                                    <h1 className='footer-center'> Privacy</h1>
                                    <h1 className='footer-center'> Cookies</h1>
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
                                    <h1 className='footer-center'> Terms</h1>
                                    <h1 className='footer-center'> Privacy</h1>
                                    <h1 className='footer-center'> Cookies</h1>
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