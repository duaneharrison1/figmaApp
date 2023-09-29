import React from 'react';
import { useState, useEffect } from 'react';
import './Footer.css';
import SocialMediaIcons from '../SocialMediaIcon/SocialMediaIcon';


export default function Footer() {
    const [userIsDesktop, setUserIsDesktop] = useState(true);
    useEffect(() => {
        window.innerWidth > 1280 ? setUserIsDesktop(true) : setUserIsDesktop(false);
    }, [userIsDesktop]);

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
                                <SocialMediaIcons />
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
                            <div className="col-md-4">
                                <SocialMediaIcons />
                            </div>

                        </div>
                    </div>
                </footer>
            )}
        </>


    )
}