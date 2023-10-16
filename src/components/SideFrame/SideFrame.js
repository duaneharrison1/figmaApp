import React, { useState } from 'react';
import './SideFrame.css';
import auth_side_frame from '../../assets/images/sideframe.png'

export default function SideFrame(props) {
    return (
        <div className='side-frame' >

            <h1 className='header'>
                Figma file to live site in one click
            </h1>
            <h2 className='sub-header'>
                You can publish an interactive website or portfolio directly from your Figma, no coding necessary.
            </h2>
            <img src={auth_side_frame} className='sideframe_img' />
        </div>



    )

}