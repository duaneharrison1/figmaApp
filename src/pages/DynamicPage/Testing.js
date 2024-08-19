import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DynamicPage.css';
import firebase from '../../firebase';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PasswordTextField from '../../components/PasswordTextfield/PasswordTextfield.js';
import bcrypt from 'bcryptjs';
import ButtonColored from '../../components/ButtonColored/ButtonColored';

function Testing({ url }) {
    const dbFirestore = firebase.firestore();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const [mobile, setMobile] = useState("");
    const [desktop, setDesktop] = useState("");
    const [faviconUrl, setFaviconUrl] = useState('');
    const [activeSubscriber, setActiveSubscriber] = useState("true");
    const [liteUser, setLiteUser] = useState(false);
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
    const isOpenInMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [password, setPassword] = useState('');
    const [isError, setIsError] = useState(null);
    //For Testing only
    const [showLoading, setShowLoading] = useState(true);
    const [getData, setGetData] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [startTimeStatic, setStartTimeStatic] = useState(null);
    const [iframeStopLoadStatic, setIframeStopLoadStatic] = useState(null);
    const [iframeStopLoad, setIframeStopLoad] = useState(null);

    const [iframeStartLoad, setIframeStartLoad] = useState(null);

    useEffect(() => {
        const startLoading = new Date();
        setStartTime(startLoading);
        setStartTimeStatic(startLoading)
        console.log(`Started loading URL at: ${startLoading.toISOString()}`);
        setIframeStartLoad(startLoading.toISOString())
    }, [isMobile, mobile, desktop]);

    const handleLoad = () => {
        const endTime = new Date();
        console.log(`Finished loading URL at: ${endTime.toISOString()}`);
        console.log(`Total load time: ${endTime - startTime}ms`);
        setShowLoading(false)
        setIframeStopLoad(endTime - startTime)
    };

    const handleLoadStatic = () => {
        const endTime = new Date();
        console.log(`Finished loading URL at: ${endTime.toISOString()}`);
        console.log(`Total load time: ${endTime - startTimeStatic}ms`);
        setIframeStopLoadStatic(endTime - startTimeStatic)
    };
    //////////

    const navigateToHome = () => {
        navigate("/");
    };



    return (



        <>
            {activeSubscriber === "true" || liteUser === true ? (<div></div>) : (
                <div className="text-overlay" onClick={navigateToHome}>
                    <p className='made-with'>Made with <span className="made-with-figmaolio">Figmafolio</span></p>
                </div>
            )}
            <div className='row'>
                <div className='test-color-iframe col-md-8'>
                    <h4 style={{ color: "red" }}>Iframe where URL is static</h4>
                    <iframe
                        src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FKYDzeQxzj7KIPRMRVFuCzi%2FSimple-Personal-Portfolio-Template-(Community)%3Fnode-id%3D10176-8860%26t%3Dv66bHDLRso52arKk-1%26scaling%3Dcontain%26content-scaling%3Dresponsive%26page-id%3D10151%253A8%26starting-point-node-id%3D10176%253A8860&hide-ui=1&hotspot-hints=0"
                        allowFullScreen
                        referrerPolicy="no-referrer"
                        onLoad={handleLoadStatic}
                        style={{ width: '50%', height: '50vh' }}
                        className='dynamicpage_view_figma_view'>
                    </iframe>

                </div>
                <div className='col-md-4'>
                    <h4> Iframe(static) Loading time: {iframeStopLoadStatic} ms</h4>
                    {showLoading == false && <h4> Hide loading screen </h4>}
                </div>
            </div>
        </>
    );
}

export default Testing;
