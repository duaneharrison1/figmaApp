import React from 'react';
import { Facebook, Twitter, Instagram } from 'react-bootstrap-icons';
export default function SocialMediaIcons() {
    return (
        <div className="social-media-icons">
            <a href="https://www.facebook.com/yourpage">
                <Facebook className="icon" />
            </a>
            <a href="https://twitter.com/yourpage">
                <Twitter className="icon" />
            </a>
            <a href="https://www.instagram.com/yourpage">
                <Instagram className="icon" />
            </a>
        </div>
    );
}

