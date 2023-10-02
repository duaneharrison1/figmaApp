import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { signOut } from "firebase/auth";
import { useNavigate, useParams, Link } from 'react-router-dom';
import './UrlForm.css';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import Navbar from '../../components/NavBar/Navbar';


export default function UrlForm() {
    const navigate = useNavigate();
    const [figmaDesktopUrl, setDesktopCustomUrl] = useState('');
    const [figmaMobileUrl, setfigmaMobileUrl] = useState('');
    const [generatedUrl, setGeneratedUrl] = useState('');
    const [title, setTitle] = useState('');
    const user = auth.currentUser;

    const handlefigmaDesktopUrl = (event) => {
        setDesktopCustomUrl(event.target.value);
    };
    const handlefigmaMobileUrl = (event) => {
        setfigmaMobileUrl(event.target.value);
    };

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

    const goToPreview = () => {
        navigate('/preview', { state: { title: title, figmaMobileUrl: figmaMobileUrl, figmaDesktopUrl: figmaDesktopUrl } });
    }

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <>
            <Navbar email={user.email} onClickLogout={handleLogout} isFromForm={true} />
            <div className='form'>
                <div className="card url-form">
                    <form onSubmit={goToPreview}>
                        <div className='form-container'>

                            <div className='row first-div'>
                                <div className='col-md-6'>
                                    <h1 className='form-title'>General</h1>
                                    <h2 className='form-sub-header'>Site Title</h2>
                                    <input
                                        className='input'
                                        type="text"
                                        placeholder='Enter your site name'
                                        value={title}
                                        onChange={handleTitle} />
                                </div>
                                <div className='col-md-6'></div>
                            </div>

                            <div className='row second-div'>
                                <div className='col-6 align-items-start'>
                                    {/* <h1 className='form-sub-header'>Free domain</h1>
                                    <p>Duane/Figmafolio.com </p> */}
                                </div>
                                <div className='col-md-6'>
                                    <h2 className='form-sub-header'>Custom domain</h2>
                                    <input
                                        className='form-input-custom-domain'
                                        type="text"
                                        placeholder='Custom domain'
                                    />
                                    <p className='note'> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg> You have to upgrade plan to have Custom domain</p>
                                    <ButtonClear label='Upgrade plan' className="upgrade-plan" />
                                </div>
                            </div>


                            <div className='second-div'>
                                <h1 className='form-title'>Enter figma prototype links</h1>
                                <p className='note'> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg> You should hide hide hotspot hints by selecting the Options menu in the prototype of Figma for a better experience</p>
                            </div>

                            <div className="fifth-div">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="row">
                                            <h2 className='form-sub-header'>
                                                Desktop
                                            </h2>
                                            <div>
                                                <input
                                                    className='form-input'
                                                    type="text"
                                                    placeholder='Custom Desktop Url'
                                                    value={figmaDesktopUrl}
                                                    onChange={handlefigmaDesktopUrl}
                                                />
                                            </div>

                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="row">
                                            <h2 className='form-sub-header'>
                                                Mobile
                                            </h2>
                                            <div>
                                                <input
                                                    className='form-input'
                                                    type="text"
                                                    placeholder='Custom Mobile Url'
                                                    value={figmaMobileUrl}
                                                    onChange={handlefigmaMobileUrl}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='container preview-btn-container'>
                            <ButtonColored className="preview-btn" label="Preview" />
                        </div>

                    </form >
                </div>
            </div>

        </>

    );
};

