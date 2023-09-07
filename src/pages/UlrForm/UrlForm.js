import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { signOut } from "firebase/auth";
import { useNavigate, useParams, Link } from 'react-router-dom';
import './UrlForm.css';
import Button from '../../components/Button/Button';
import { InfoCircle } from 'react-bootstrap-icons';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import Navbar from '../../components/NavBar/Navbar';
import Footer from '../../components/Footer/Footer';

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
            <Navbar email={user.email} onClickLogout={handleLogout} />
            <div className='form'>
                <div className='container'>
                    <div className="card url-form">
                        <form onSubmit={goToPreview}>
                            <div className="container">
                                <div className='container'>
                                    <div className='row first-div'>
                                        <div className='col-md-6'>
                                            <h1 className='form-title'>General</h1>
                                            <h2 className='form-sub-header'>Site Title</h2>
                                            <input
                                                className='input'
                                                type="text"
                                                placeholder='Title'
                                                value={title}
                                                onChange={handleTitle} />
                                        </div>
                                        <div className='col-md-6'></div>
                                    </div>

                                    <div className='row second-div'>
                                        <div className='col-md-6 '>
                                            <h1 className='form-sub-header'>Free domain</h1>
                                            <p>Duane/Figmafolio.com </p>
                                        </div>
                                        <div className='col-md-6'>
                                            <h2 className='form-sub-header'>Custom domain</h2>
                                            <input
                                                className='input'
                                                type="text"
                                                placeholder='Custom domain'
                                            />
                                            <ButtonClear label='Upgrade plan' className="upgrade-plan" />
                                        </div>
                                    </div>
                                </div>

                                <div className='container second-div'>
                                    <h1 className='form-title'>Enter figma prototype links</h1>
                                    <p> <InfoCircle /> You should hide hide hotspot hints by selecting the Options menu in the prototype of Figma for a better experience</p>
                                </div>

                                <div className="container">
                                    <div className="row gx-5">
                                        <div className="col-md-6">
                                            <div className="row">
                                                <h2 className='form-sub-header'>
                                                    Desktop
                                                </h2>
                                                <input
                                                    className='input'
                                                    type="text"
                                                    placeholder='Custom Desktop Url'
                                                    value={figmaDesktopUrl}
                                                    onChange={handlefigmaDesktopUrl}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <div className="row">
                                                <h2 className='form-sub-header'>
                                                    Mobile
                                                </h2>
                                                <input
                                                    className='input'
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

                            <div className='container preview-btn-container'>
                                <Button className="preview-btn" label="Preview" />
                            </div>

                        </form >
                    </div>
                </div>
            </div>
            <Footer />
        </>

    );
};

