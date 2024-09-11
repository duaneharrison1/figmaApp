import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDocs, updateDoc, QuerySnapshot, query, where, collectionGroup } from 'firebase/firestore'
import { db, auth, uploadFaviconUrl } from '../../firebase';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import AlertModal from '../../components/AlertModal/AlertModal';

import './Preview.css';
import firebase from '../../firebase';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import chevronLeft from '../../assets/images/chevron-left.png';

export default function PreviewFromPlugin() {
    const { t } = useTranslation();
    const { id } = useParams(); // Extracts 'qwerty' from '/url-qwerty'
    const currentLanguage = i18n.language;
    const lng = navigator.language;
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [randomurl, setRandomUrl] = useState('');
    const [user, setUser] = useState(null);
    const [userIsDesktop, setUserIsDesktop] = useState(true);
    const [mobile, setMobile] = useState("");
    const [desktop, setDesktop] = useState("");
    const dbFirestore = firebase.firestore();
    const isOpenInMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [docId, setDocId] = useState(
        location && location.state && location.state.object
            ? location.state.object.id
            : ""
    );
    const [title, setTitle] = useState(
        location && location.state && location.state.object && location.state.object.title
            ? location.state.object.title
            : ""
    );

    const [faviconImage, setFaviconImage] = useState(
        location && location.state && location.state.object && location.state.object.faviconUrl
            ? location.state.object.faviconUrl
            : ""
    );
    const [faviconFromLocal, setFaviconFromLocal] = useState(null);
    const [figmaDesktopUrl, setFigmaDesktopUrl] = useState(
        location.state && location.state.object && location.state.object.urls && location.state.object.urls.figmaDesktopUrl
            ? location.state.object.urls.figmaDesktopUrl
            : ""
    );
    const [figmaMobileUrl, setFigmaMobileUrl] = useState(
        location.state && location.state.object && location.state.object.urls && location.state.object.urls.figmaMobileUrl
            ? location.state.object.urls.figmaMobileUrl
            : ""
    );
    const [oldDomain, setOldDomain] = useState(
        location && location.state && location.state.object && location.state.object.customDomain
            ? location.state.object.customDomain
            : ""
    );
    const [domain, setDomain] = useState(
        location && location.state && location.state.object && location.state.object.customDomain
            ? location.state.object.customDomain
            : ""
    );



    useEffect(() => {
        setRandomUrl(generateRandomString(10))
        const fetchData = async () => {
            const snapshot1 = await dbFirestore.collection('pluginFolio').doc(id).get();
            if (snapshot1.exists) {
                const data = snapshot1.data();
                console.log("Document Dataxxxx:", data);
                setMobile(data?.mobileUrl);
                setDesktop(data?.desktopUrl);
                console.log("Desktop URL:xxxxx", data?.desktopUrl);
            }

            try {
                dbFirestore.collectionGroup('url').where('generatedUrl', '==', randomurl).get().then(snapshot => {
                    if (snapshot.docs.length !== 0) {
                        setRandomUrl(generateRandomString(10))
                        console.log("secondRandomUrl " + randomurl)
                    }
                })
            } catch (error) {
                console.error("error" + error);
            }
        };
        fetchData();
    }, []);



    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSwitchChange = () => {
        setIsMobile(!isMobile);
    };

    function generateRandomString(length) {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        return result;
    }

    function removeWordFromString(inputString, wordToRemove) {
        const regex = new RegExp(`\\b${wordToRemove}\\b`, 'gi');
        const resultString = inputString.replace(regex, '');
        return resultString;
    }

    function editUrl(url) {
        const originalString = url;
        const wordToRemove = "https://";
        const hideUi = "&hide-ui=1"
        const hotspot = "&hotspot-hints=0"
        const embedHost = "www.figma.com/embed?embed_host=share&url=https%3A%2F%2F"
        var newUrl = ""
        var modifiedUrl = ""
        const modifiedString = removeWordFromString(originalString, wordToRemove);
        if (url != '') {
            if (!modifiedString.includes(embedHost)) {
                newUrl = "https://" + embedHost + modifiedString
            } else {
                newUrl = url;
            }

            if (!newUrl.includes(hideUi)) {
                newUrl += hideUi
            }

            if (!newUrl.includes(hotspot)) {
                newUrl += hotspot
            }


            if (newUrl.includes("scaling=contain")) {
                modifiedUrl = newUrl.replace(new RegExp("scaling=contain", 'g'), "scaling=scale-down-width");
                newUrl = modifiedUrl
            } else if (newUrl.includes("scaling=min-zoom")) {
                modifiedUrl = newUrl.replace(new RegExp("scaling=min-zoom", 'g'), "scaling=scale-down-width");
                newUrl = modifiedUrl
            } else if (newUrl.includes("scaling=scale-down")) {
                if (!newUrl.includes("scaling=scale-down-width")) {
                    modifiedUrl = newUrl.replace(new RegExp("scaling=scale-down", 'g'), "scaling=scale-down-width");
                    newUrl = modifiedUrl
                }
            }

        } else {
            newUrl = ""
        }

        return newUrl
    }

    const saveFigmaUrl = async () => {
        navigate("/" + currentLanguage + '/plugin-auth', { state: { fromPlugin: "true", desktopUrl: desktop, mobileUrl: mobile, generatedUrl: randomurl } });
    }

    useEffect(() => {
        const handleResize = () => {
            setUserIsDesktop(window.innerWidth > 768);
        };
        handleResize()
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    return (
        <>

            <div>
                {userIsDesktop ? (
                    <div>
                        <div className="row nav-container m-0 ">
                            <div className="col m-0 p-0">
                                {/* <div className='d-flex align-items-center your-library-container' onClick={backToDashboard}>
                                    <img alt="x" src={chevronLeft} className='chevron-left' />
                                    <p className='back-your-library'>button TO DO</p>
                                </div> */}
                            </div>
                            <div className="col m-0 p-0 ">
                                <div className='switch-container'>
                                    <div container="preview-switch-container">
                                        <h1 className='preview-switch-header'>{t('preview')}</h1>
                                        <div className='switch-container'>
                                            <p className='desktop-mobile-label'>{t('desktop')}</p>
                                            <div className='container'>
                                                <Form.Check
                                                    className='preview-switch'
                                                    type="switch"
                                                    id="custom-switch"
                                                    checked={isMobile}
                                                    onChange={handleSwitchChange}
                                                />
                                            </div>
                                            <p className='desktop-mobile-label'> {t('mobile')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col m-0 p-0">
                                < div className='draft-publish-container'>

                                    <ButtonColored
                                        className="update-btn"
                                        label="Publish"
                                        onClick={saveFigmaUrl} />
                                </div >
                            </div>
                        </div>

                        <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />
                        <iframe
                            title="preview"
                            src={isMobile ? editUrl(mobile) : editUrl(desktop)}
                            allowFullScreen
                            referrerpolicy="no-referrer"
                            style={{ width: '100%', height: '100vh' }}
                            className='figma_view'></iframe>
                    </div >
                ) : (
                    <div>
                        <div className="mobile-nav-container">
                            <div className="row">
                                {/* <div className="col mobile-preview-figmalinks">
                                    <div className='d-flex align-items-center your-library-container' onClick={backToDashboard}>
                                        <img src={chevronLeft} className='chevron-left' />
                                        <p className='mobile-preview-back-your-library'> button TO DO</p>
                                    </div>
                                </div> */}
                                <div className="col">
                                    <div className='switch-container'>
                                        <p className='desktop-mobile-label m-0'>{t('desktop')}</p>
                                        <div className='mobile-form-switch-container'>
                                            <Form.Check
                                                className='form-switch'
                                                type="switch"
                                                id="custom-switch"
                                                checked={isMobile}
                                                onChange={handleSwitchChange}
                                            />
                                        </div>
                                        <p className='desktop-mobile-label m-0'> {t('mobile')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />
                        <iframe
                            title="preview"
                            src={isMobile ? editUrl(mobile) : editUrl(desktop)}
                            allowFullScreen
                            style={{ width: '100%', height: '100vh' }}
                            className='figma_view'>
                        </iframe>

                        <div className='mobile-button-container'>

                            <ButtonColored
                                className="update-btn-mobile"
                                label="Publish"
                                onClick={saveFigmaUrl} />
                        </div>
                    </div >
                )
                }
            </div>
        </>
    );
};

