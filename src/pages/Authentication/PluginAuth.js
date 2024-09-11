import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import './Auths.css';
import { auth } from '../../firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import SignUpPage from './SignupPage.js'
import LoginPage from './LoginPage.js'
import main_header_image from './../../assets/images/main-header-image-v2.png';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n.js';
export default function PluginAuth(props) {
    const location = useLocation();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [userIsDesktop, setUserIsDesktop] = useState(true);
    const [figmaDesktopUrl, setFigmaDesktopUrl] = useState(
        location.state && location.state && location.state.mobileUrl
            ? location.state.mobileUrl
            : ""
    );
    const [figmaMobileUrl, setFigmaMobileUrl] = useState(
        location.state && location.state && location.state.desktopUrl
            ? location.state.desktopUrl
            : ""
    );
    const [generatedUrl, setgeneratedUrl] = useState(
        location.state && location.state && location.state.generatedUrl
            ? location.state.generatedUrl
            : ""
    );

    useEffect(() => {
        console.log("xxxx" + figmaDesktopUrl);
        console.log("xxxx" + figmaDesktopUrl);
        console.log("xxxx" + generatedUrl);
        window.innerWidth > 1280 ? setUserIsDesktop(true) : setUserIsDesktop(false);
    }, [userIsDesktop]);


    const [user, setUser] = useState(null);
    const [selectedTab, setSelectedTab] = useState("tab2");

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const navigateToHome = () => {
        navigate("/");
    };

    return (
        <>
            {/* {user ? (<Navigate to="/dashboard" />) : ( */}

            <div className='container-fluid main-auth-container'>
                <div className='row'>

                    <div className='col-md-5 sideframe-view' >
                        <h1 onClick={navigateToHome} className='main-title'>Figmafolio</h1 >
                        <div className='side-frame'>

                            <div className='side-frame-content'>
                                {selectedTab === "tab1" ?
                                    (<div className='auth-sub-header-container'>
                                        <h2 className='auth-sub-header'>
                                            {t('glad-your-back')}
                                        </h2>
                                        <h2 className='auth-sub-header'>
                                            {t('time-to-get-creating')}
                                        </h2>
                                    </div>) : selectedTab === "tab2" && generatedUrl === "" ?
                                        (
                                            <div className='auth-sub-header-container'>

                                                <h2 className='auth-sub-header'>
                                                    {t('youre-almost-there')}
                                                </h2>
                                                <h2 className='auth-sub-header'>
                                                    {t('sign-up-to-showcase-your-designs')}
                                                </h2>
                                            </div>
                                        ) : (
                                            <div className='auth-sub-header-container-from-plugin'>
                                                <h2 className='auth-header-from-plugin'>
                                                    Almost There!
                                                </h2>
                                                <h2 className='auth-sub-header-from-plugin'>
                                                    To publish your site and save your progress, you'll need to create a Figmafolio account. It only takes a minute!
                                                </h2>
                                            </div>
                                        )
                                }
                                {generatedUrl === "" || selectedTab === "tab1" ? (
                                    <img src={main_header_image} className='sideframe_img' />
                                ) : (
                                    <></>
                                )}

                            </div>
                        </div>
                    </div>

                    <div className='col-md-7 tab-view p-0'>
                        <div className='main-panel'>
                            <div className=' container main-title-container'>
                                <h1 className='main-title'></h1 >
                            </div >
                            <h1 className='header-text'>{t('welcome-to-figmafolio')}</h1>
                            <Tabs className='nav-pills'
                                id="tabs" activeKey={selectedTab}
                                onSelect={(k) => setSelectedTab(k)}>
                                <Tab eventKey="tab1" title={t('login')}>
                                    <LoginPage />
                                </Tab>
                                <Tab eventKey="tab2" title={t('signup')}>
                                    <SignUpPage figmaDesktopUrl={figmaDesktopUrl} figmaMobileUrl={figmaMobileUrl} generatedUrl={generatedUrl} />
                                </Tab>
                            </Tabs>
                        </div >
                    </div >


                </div >
            </div >
        </>
    )
}
