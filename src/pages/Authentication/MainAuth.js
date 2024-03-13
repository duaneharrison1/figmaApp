import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import './Auths.css';
import { auth } from '../../firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignUpPage from './SignupPage.js'
import LoginPage from './LoginPage.js'

import auth_side_frame from '../../assets/images/sideframe.png'

export default function MainAuth(props) {

    const [userIsDesktop, setUserIsDesktop] = useState(true);
    useEffect(() => {
        window.innerWidth > 1280 ? setUserIsDesktop(true) : setUserIsDesktop(false);
    }, [userIsDesktop]);

    const location = useLocation();
    const tab = useState(location.state.name);
    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState("tab2");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);


    return (
        <div className='main-auth-container m-0 p-0'>
            {user ? (<Navigate to="/dashboard" />) : (
                <div>
                    <div className='container-fluid desktop-main-auth-container'>
                        <div className='row'>
                            <div className='col-md-7  tab-view'>
                                <div className='card'>
                                    <div className=' container main-title-container'>
                                        <h1 className='main-title'>Figmafolio</h1>
                                    </div>

                                    <h1 className='header-text'>Welcome to Figmafolio</h1>
                                    <Tabs className='nav-pills' defaultActiveKey={tab[0]}
                                        id="tabs" activeKey={selectedTab}
                                        onSelect={(k) => setSelectedTab(k)}>
                                        <Tab eventKey="tab1" title="Log in">
                                            <LoginPage />
                                        </Tab>
                                        <Tab eventKey="tab2" title="Sign up">
                                            <SignUpPage />
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>

                            <div className='col-md-5 sideframe-view' >
                                <div className='side-frame'>
                                    <div className='side-frame-content'>
                                        {selectedTab === "tab1" ?
                                            (<div className='auth-sub-header-container'>
                                                <h2 className='auth-sub-header'>
                                                    Glad you're back!
                                                </h2>
                                                <h2 className='auth-sub-header'>
                                                    Time to get creating.
                                                </h2>
                                            </div>) :
                                            (<div className='auth-sub-header-container'>

                                                <h2 className='auth-sub-header'>
                                                    You're almost there!
                                                </h2>
                                                <h2 className='auth-sub-header'>
                                                    Sign up to showcase your designs.
                                                </h2>
                                            </div>)}
                                        <img src={auth_side_frame} className='sideframe_img' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            )}
        </div >
    )
}
