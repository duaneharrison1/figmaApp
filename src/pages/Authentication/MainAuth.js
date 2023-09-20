import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import SideFrame from '../../components/SideFrame/SideFrame.js';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import './Auths.css';
import { auth } from '../../firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignUpPage from './SignupPage.js'
import LoginPage from './LoginPage.js'



export default function MainAuth(props) {
    const location = useLocation();
    const tab = useState(location.state.name);
    console.log(tab[0])
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Set the user state
        });

        return () => unsubscribe(); // Clean up the listener when component unmounts
    }, []);


    return (<>

        {user ? (<Navigate to="/dashboard" />) : (
            <div className='container main-auth-container'>
                <div className='row'>
                    <div className='col-6 tab-view'>
                        <h1 className='header-text'>Welcome to Figmafolio</h1>
                        <Tabs className='nav-pills' defaultActiveKey={tab[0]} id="tabs">
                            <Tab eventKey="tab1" title="Log in">
                                <LoginPage />
                            </Tab>
                            <Tab eventKey="tab2" title="Sign up">
                                <SignUpPage />
                            </Tab>
                        </Tabs>
                    </div>

                    <div className='col-6' >
                        <SideFrame />
                    </div>
                </div>
            </div>
        )}

    </>
    )
}
