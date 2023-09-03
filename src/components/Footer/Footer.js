

import React from 'react';
import './Footer.css';
import SocialMediaIcons from '../SocialMediaIcon/SocialMediaIcon';
export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h1> Figmafolio</h1>
                    </div>
                    <div className="col-md-4">
                        <div className="row">
                            <div className="col-md-4"> <h1> Terms</h1></div>
                            <div className="col-md-4"> <h1> Privacy</h1></div>
                            <div className="col-md-4"> <h1> Cookies</h1></div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <SocialMediaIcons />
                    </div>

                </div>
            </div>
        </footer>
    )
}