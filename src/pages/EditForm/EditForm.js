import React, { useState, useEffect } from 'react';

import { useNavigate, NavLink, useParams, useLocation } from 'react-router-dom';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { signOut } from "firebase/auth";
import './EditForm.css';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import AlertModal from '../../components/AlertModal/AlertModal';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/NavBar/Navbar';
import { InfoCircle } from 'react-bootstrap-icons';
import ButtonClear from '../../components/ButtonClear/ButtonClear';

export default function EditForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [figmaDesktopUrl, setDesktopCustomUrl] = useState(location.state.object.urls.figmaMobileUrl);
    const [figmaMobileUrl, setfigmaMobileUrl] = useState(location.state.object.urls.figmaMobileUrl);
    const [isDraft, setIsDraft] = useState(location.state.object.urls.isDraft);
    const [generatedUrl, setgeneratedUrl] = useState(location.state.object.generatedUrl);
    const [title, setTitle] = useState(location.state.object.title);
    const user = auth.currentUser;
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');


    const goToPreview = () => {
        navigate('/preview', { state: { title: title, figmaMobileUrl: figmaMobileUrl, figmaDesktopUrl: figmaDesktopUrl, fromEdit: true, isDraft: location.state.object.isDraft, docId: location.state.object.id, generatedUrl: generatedUrl } });
    }



    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };




    const handlefigmaDesktopUrl = (event) => {
        setDesktopCustomUrl(event.target.value);
    };
    const handlefigmaMobileUrl = (event) => {
        setfigmaMobileUrl(event.target.value);
    };

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };

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
                <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />
                <div className='container'>
                    <div className="card url-form">
                        <form onSubmit={goToPreview}>
                            <div className="container">
                                <div className="container">
                                    <div className="row first-div">
                                        <div className="col-md-6">
                                            <div className="row">
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
                                                <p className='note'> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg> You have to upgrade plan to have Custom domain</p>
                                                <ButtonClear label='Upgrade plan' className="upgrade-plan" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className='container second-div'>
                                        <h1 className='form-title'>Enter figma prototype links</h1>
                                        <p className='note'> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#424242" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> You should hide hide hotspot hints by selecting the Options menu in the prototype of Figma for a better experience</p>
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
                                                        // value={location.state.object.urls.figmaDesktopUrl}
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
                                                        // value={location.state.object.urls.figmaMobileUrl}
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
            </div>

        </>
    );
};

