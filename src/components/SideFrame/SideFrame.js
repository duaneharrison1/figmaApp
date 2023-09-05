import React, { useState } from 'react';
import './SideFrame.css';
import landing_page from '../../assets/images/landing_page.png'

export default function SideFrame(props) {
    return (
        <div className='side-frame' style={{ backgroundImage: `url(${landing_page})` }}>

            <h1 className='header'>
                Seamless Showcase: Unify Your Prototypes with a Custom URL
            </h1>
            <h2 className='sub-header'>
                No coding require
            </h2>
        </div>



    )

}