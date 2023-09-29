import React from 'react';
import './SocialMediaIcon.css';
import Linkedin from '../../assets/images/Linkedin.png';
import Facebook from '../../assets/images/Facebook.png';
import Twitter from '../../assets/images/Twitter.png';
export default function SocialMediaIcons() {
    return (
        <div className="flex-container icon-container">

            <img className='icon-img' src={Linkedin} />
            <img className='icon-img' src={Facebook} />
            <img className='icon-img' src={Twitter} />
        </div>
    );
}

