import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import LoginPage from '../authentication/LoginInPage';
import SignUpPage from '../authentication/SignUpPage';
import SideFrame from './Components/SideFrame/SideFrame.js';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import './Auth.css';



export default function MainAuth() {

    return (<>
        <div className='container'>

            <div className='row'>
                <div className='col-6 tab-view'>
                    <h1 className='header-text'>Welcome to Figmafolio</h1>
                    <Tabs className='nav-pills' defaultActiveKey="tab1" id="tabs">
                        <Tab eventKey="tab1" title="Log in">
                            <LoginPage />
                        </Tab>
                        <Tab eventKey="tab2" title="Sign up">
                            <SignUpPage />
                        </Tab>
                    </Tabs>
                </div>

                <div className='col-6'>
                    <SideFrame />
                </div>
            </div>
        </div>


    </>
    )
}