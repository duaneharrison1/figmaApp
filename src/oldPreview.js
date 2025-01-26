import React, { useState, useEffect } from 'react';

import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDocs, updateDoc, QuerySnapshot, query, where, collectionGroup } from 'firebase/firestore'
import { db, auth, uploadFaviconUrl } from '../../firebase';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import AlertModal from '../../components/AlertModal/AlertModal';
import axios from "axios";
import './Preview.css';
import firebase from '../../firebase';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import chevronLeft from '../../assets/images/chevron-left.png';
export default function Preview() {
    const { t } = useTranslation();

    const [ispublicBtnClick, setIsPublicBtnClick] = useState(false);
    const [isSaveAsDraftBtnClick, setSaveAsDraftBtnClick] = useState(false);
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
    const locationStateImgUrl = location.state.imgUrl
    const locationStateDomain = location.state.domain?.toLowerCase()
    const locationStateNewDomain = location.state.newCustomDomain?.toLowerCase()
    const currentLanguage = i18n.language;
    const [docId, setDocId] = useState(
        location.state.docId
    );
    const [postData, setPostData] = useState({
        "name": locationStateDomain
    });

    const [newCustomDomainData, setNewCustomDomainData] = useState({
        "name": locationStateNewDomain
    });

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 83YzDqNvO4OoVtKXQXJ4mTyj'
    };
    const lng = navigator.language;

    // useEffect(() => {

    //     i18n.changeLanguage(lng);
    // }, [])
    useEffect(() => {
        if (location.state.figmaMobileUrl == "") {
            setMobile(location.state.figmaDesktopUrl)
        } else {
            setMobile(location.state.figmaMobileUrl)
        }

        if (location.state.figmaDesktopUrl == "") {
            setDesktop(location.state.figmaMobileUrl)
        } else {
            setDesktop(location.state.figmaDesktopUrl)
        }
        window.innerWidth > 1280 ? setUserIsDesktop(true) : setUserIsDesktop(false);
    }, [userIsDesktop]);


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Set the user state
        });
        return () => unsubscribe(); // Clean up the listener when component unmounts
    }, []);

    useEffect(() => {
        setRandomUrl(generateRandomString(10))
        const fetchData = async () => {
            try {
                dbFirestore.collectionGroup('url').where('generatedUrl', '==', randomurl).get().then(snapshot => {
                    if (snapshot.docs.length !== 0) {
                        setRandomUrl(generateRandomString(10))
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

    const addDomainToVercel = async () => {
        try {
            const response = await axios.post(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                newCustomDomainData, {
                headers: headers,
            }).then((response) => {

                updateApp()

            }).catch((error) => {
                if (error.response.data.error.code == 'forbidden') {
                    alert("forbidden")
                } else if (error.response.data.error.code == 'domain_already_in_use') {
                    alert("The custom domain is already taken, please edit your url in the dashboard or contact the admin")
                } else if (error.response.data.error.code == 'invalid_domain') {
                    alert("The specified value is not a fully qualified domain name.")
                }
                else {
                    alert(error)
                    console.log(error.response.data.error)
                }
            });
        } catch (error) {
            alert(error)
        }
    };


    const addDomainToVercelAsDraft = async () => {
        try {
            const response = await axios.post(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                newCustomDomainData, {
                headers: headers,
            }).then((response) => {

                updateAppAsDraft()

            }).catch((error) => {
                if (error.response.data.error.code == 'forbidden') {
                    alert("forbidden")
                } else if (error.response.data.error.code == 'domain_already_in_use') {
                    alert("The custom domain is already taken, please edit your url in the dashboard or contact the admin")
                } else if (error.response.data.error.code == 'invalid_domain') {
                    alert("The specified value is not a fully qualified domain name.")
                }
                else {
                    alert(error)
                    console.log(error.response.data.error)
                }
            });
        } catch (error) {
            alert(error)
        }
    };

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

    const handleSaveFormAsDraft = async (event) => {
        setSaveAsDraftBtnClick(true);
        event.preventDefault();
        if (locationStateDomain == "") {
            saveNewFormAsDraft();
        } else {
            try {
                const response = await axios.post(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                    postData, {
                    headers: headers,
                }).then((response) => {
                    saveNewFormAsDraft()
                }).catch((error) => {
                    if (error.response.data.error.code == 'forbidden') {
                        alert("forbidden")
                    } else if (error.response.data.error.code == 'domain_already_in_use') {
                        alert("The custom domain is already taken, please edit your url in the dashboard or contact the admin")
                    } else if (error.response.data.error.code == 'invalid_domain') {
                        alert("The specified value is not a fully qualified domain name.")
                    }
                    else {
                        alert(error)
                        console.log(error.response.data.error)
                    }
                    setSaveAsDraftBtnClick(false);
                });
            } catch (error) {
                alert(error)
                setSaveAsDraftBtnClick(false);
            }
        }
    }

    const handleDeleteDomainAsDraft = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 83YzDqNvO4OoVtKXQXJ4mTyj'
            };

            const response = await axios.delete(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains/${locationStateDomain}?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                {
                    headers: headers,
                }).then((response) => {
                    updateAppAsDraft()
                }).catch((error) => {
                    alert(error)
                    console.log(error.response.data.error)
                });
        } catch (error) {
            alert(error)
        }
    }
    const handleDeleteDomain = async () => {
        try {
            const response = await axios.delete(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains/${locationStateDomain}?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                {
                    headers: headers,
                }).then((response) => {
                    updateApp()
                }).catch((error) => {
                    alert(error)
                    console.log(error.response.data.error)
                });
        } catch (error) {
            alert(error)
        }
    }


    const handleAddNewDomainFromEdit = async () => {
        try {
            const response = axios.post(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                newCustomDomainData, {
                headers: headers,
            }).then((response) => {
                updateApp()
                alert("Successfully added your domain. Please configure it to your domain service provider")
            }).catch((error) => {
                if (error.response.data.error.code == 'forbidden') {
                    alert("forbidden")
                } else if (error.response.data.error.code == 'domain_already_in_use') {
                    alert("The custom domain is already taken, please edit your url in the dashboard or contact the admin")
                } else if (error.response.data.error.code == 'invalid_domain') {
                    alert("The specified value is not a fully qualified domain name.")
                }
                else {
                    alert(error)
                    console.log(error.response.data.error)
                }
            });
        } catch (error) {
            alert(error)
        }
    }


    const handleAddNewDomainFromEditAsDraft = async () => {
        try {
            const response = axios.post(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                newCustomDomainData, {
                headers: headers,
            }).then((response) => {
                updateAppAsDraft()
                alert("Successfully added your domain. Please configure it to your domain service provider")
            }).catch((error) => {
                if (error.response.data.error.code == 'forbidden') {
                    alert("forbidden")
                } else if (error.response.data.error.code == 'domain_already_in_use') {
                    alert("The custom domain is already taken, please edit your url in the dashboard or contact the admin")
                } else if (error.response.data.error.code == 'invalid_domain') {
                    alert("The specified value is not a fully qualified domain name.")
                }
                else {
                    alert(error)
                    console.log(error.response.data.error)
                }
            });
        } catch (error) {
            alert(error)
        }
    }

    const handleDeleteAndUpdateDomain = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 83YzDqNvO4OoVtKXQXJ4mTyj'
            };

            const response = await axios.delete(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains/${locationStateDomain}?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                {
                    headers: headers,
                }).then((response) => {
                    handleAddNewDomainFromEdit()
                }).catch((error) => {
                    if (error.response.data.error.code == "not_found") {
                        handleAddNewDomainFromEdit()
                    }
                });
        } catch (error) {
            alert(error)

        }
    }
    const handleDeleteAndUpdateDomainAsDraft = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 83YzDqNvO4OoVtKXQXJ4mTyj'
            };

            const response = await axios.delete(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains/${locationStateDomain}?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                {
                    headers: headers,
                }).then((response) => {
                    handleAddNewDomainFromEditAsDraft()
                }).catch((error) => {
                    if (error.response.data.error.code == "not_found") {
                        handleAddNewDomainFromEditAsDraft()
                    }
                });
        } catch (error) {
            alert(error)

        }
    }

    const updateApp = async () => {
        try {
            if (locationStateImgUrl != '') {
                if (location.state.isNewFavicon == "true") {
                    var faviconUrlFromFirebase = await uploadFaviconUrl(locationStateImgUrl, randomurl);
                } else {
                    faviconUrlFromFirebase = location.state.imgUrl;
                }
            } else {
                faviconUrlFromFirebase = ""
            }
            const ref = await doc(db, "user", user.uid, "url", location.state.docId)
            updateDoc(ref, {
                title: location.state.title,
                customDomain: locationStateNewDomain,
                isDraft: "false",
                faviconUrl: faviconUrlFromFirebase,
                urls: {
                    figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                    figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                },
                updatedAt: new Date()
            }).then(() => {
                alert("success")
            });
            if (location.state.isDraft == 'false') {
                window.open('https://figmafolio.com/' + location.state.generatedUrl, '_blank');
            }
        } catch (error) {
            alert(error)
        }
    }

    const updateAppAsDraft = async () => {
        try {
            if (locationStateImgUrl != '') {
                var faviconUrlFromFirebase = await uploadFaviconUrl(locationStateImgUrl, randomurl);
            }
            const ref = await doc(db, "user", user.uid, "url", location.state.docId)
            updateDoc(ref, {
                title: location.state.title,
                customDomain: locationStateNewDomain,
                isDraft: "true",
                faviconUrl: faviconUrlFromFirebase,
                urls: {
                    figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                    figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                },
                updatedAt: new Date()
            }).then(() => {
                alert("success")
            }
            )
        } catch (error) {
            alert(error)
        }
    }

    const handleUpdateForm = async (event) => {
        event.preventDefault();
        try {
            if (locationStateNewDomain == "" && locationStateDomain != "") {
                handleDeleteDomain()
            } else if (locationStateNewDomain != "" && locationStateDomain != locationStateNewDomain) {
                if (locationStateDomain == "") {
                    addDomainToVercel()
                } else {
                    handleDeleteAndUpdateDomain()
                }
            } else {
                updateApp()
            }
        } catch (error) {
            setShowModal(true);
            setModalMessage("Error updating")
            console.error('Error updating document:', error);
        }
    };

    const handleUpdateFormAsDraft = async (event) => {
        console.log("handleUpdateFormAsDraft")
        event.preventDefault();
        try {
            if (locationStateNewDomain == "" && locationStateDomain != "") {
                handleDeleteDomainAsDraft()
            } else if (locationStateNewDomain != "" && locationStateDomain != locationStateNewDomain) {
                if (locationStateDomain == "") {
                    addDomainToVercelAsDraft()
                } else {
                    handleDeleteAndUpdateDomain()
                }
            } else if (locationStateDomain == "" && locationStateNewDomain == "") {
                updateAppAsDraft()
            } else {
                handleDeleteAndUpdateDomainAsDraft()
            }
        } catch (error) {
            setShowModal(true);
            setModalMessage("Error updating")
            console.error('Error updating document:', error);
        }
    };
    const saveNewFormAsDraft = async () => {
        try {
            if (locationStateImgUrl != '') {
                var faviconUrlFromFirebase = await uploadFaviconUrl(locationStateImgUrl, randomurl);
            }
            const docRef = await dbFirestore.collection('user').doc(user.uid).collection
                ("url").add({
                    userId: user.uid,
                    title: location.state.title,
                    customDomain: locationStateDomain,
                    isDraft: "true",
                    generatedUrl: randomurl,
                    faviconUrl: faviconUrlFromFirebase,
                    urls: {
                        figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                        figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                    },
                    createdAt: new Date(),
                })
        } catch (err) {
            alert(err.message)
            setSaveAsDraftBtnClick(false);
        } finally {
            alert("success")
            setSaveAsDraftBtnClick(false);
            navigate("/" + currentLanguage + '/dashboard');
        }
    }



    const saveNewForm = async () => {
        try {
            if (locationStateImgUrl != '') {
                var faviconUrlFromFirebase = await uploadFaviconUrl(locationStateImgUrl, randomurl);
            } else {
                faviconUrlFromFirebase = ""
            }
            const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").add({
                userId: user.uid,
                title: location.state.title,
                customDomain: locationStateDomain,
                isDraft: "false",
                generatedUrl: randomurl,
                faviconUrl: faviconUrlFromFirebase,
                urls: {
                    figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                    figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                },
                createdAt: new Date(),
            })
        } catch (err) {
            alert(err.message)
            setIsPublicBtnClick(false);
        } finally {
            alert("success")
            window.open('https://figmafolio.com/' + randomurl, '_blank');
            navigate("/" + currentLanguage + '/dashboard');
        }
    }

    const handleSaveForm = async (e) => {
        setIsPublicBtnClick(true);
        e.preventDefault();
        if (locationStateDomain == "") {
            saveNewForm()
        } else {
            try {
                const response = await axios.post(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                    postData, {
                    headers: headers,
                }).then((response) => {
                    saveNewForm()
                }).catch((error) => {
                    if (error.response.data.error.code == 'forbidden') {
                        alert("forbidden")
                    } else if (error.response.data.error.code == 'domain_already_in_use') {
                        alert("The custom domain is already taken, please edit your url in the dashboard or contact the admin")
                    } else if (error.response.data.error.code == 'invalid_domain') {
                        alert("The specified value is not a fully qualified domain name.")
                    }
                    else {
                        alert(error)
                    }
                    setIsPublicBtnClick(false);
                });
            } catch (error) {
                alert(error)
                setIsPublicBtnClick(false);
            }
        }
    }

    const saveFigmaUrl = async () => {
        try {
            if (docId) {
                const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").doc(docId).update({
                    urls: {
                        figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                        figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                    },
                    updatedAt: new Date()
                })
            } else {
                const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").add({
                    userId: user.uid,
                    generatedUrl: randomurl,
                    isDraft: "false",
                    urls: {
                        figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                        figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                    },
                    createdAt: new Date(),
                })
                setDocId(docRef.id);
            }
        } catch (err) {
            alert(err.message)
        } finally {
            alert("Success")
        }
    }

    const backToDashboard = () => {
        //  window.history.back();
        // navigate("/" + currentLanguage + '/edit-folio', { state: { object, subscriptionType: subscriptionType } });
        // navigate("/" + currentLanguage + '/edit-folio', { state: { title: title, figmaMobileUrl: figmaMobileUrl, figmaDesktopUrl: figmaDesktopUrl, docId: docId , subscriptionType: subscriptionType, generatedUrl: generatedUrl, faviconUrl: faviconUrl, domain: domain} });
        // navigate("/" + currentLanguage + '/dashboard', { state: { docId: docId } });
    }


    return (
        <>
            {!user || !location.state ? (
                navigate("/")
            ) : (
                <div>

                    {!userIsDesktop ? (
                        <div>
                            <div className="mobile-nav-container m-0">
                                <div className="row">
                                    <div className="col m-0 p-0">
                                        <div className='d-flex align-items-center your-library-container' onClick={backToDashboard}>
                                            <img src={chevronLeft} className='chevron-left' />
                                            <p className='back-your-library'> Figma Links</p>
                                        </div>
                                    </div>
                                    <div className="col m-0 p-0">
                                        <div className='switch-container'>
                                            <p className='desktop-mobile-label'>{t('desktop')}</p>
                                            <div className='form-switch-container'>
                                                <Form.Check
                                                    className='form-switch'
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

                            <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />
                            <iframe
                                src={isMobile ? editUrl(mobile) : editUrl(desktop)}
                                allowFullScreen
                                style={{ width: '100%', height: '100vh' }}
                                className='figma_view'>
                            </iframe>

                            <div className='mobile-button-container'>

                                <ButtonColored
                                    className="update-btn"
                                    label={t('update')}
                                    onClick={saveFigmaUrl} />
                                {/* <ButtonClear
                                    className="save-as-draft"
                                    label={t('save-as-draft')}
                                    isDisabled={isSaveAsDraftBtnClick}
                                    onClick={location.state.fromEdit === true ?
                                        handleUpdateFormAsDraft :
                                        handleSaveFormAsDraft} /> */}
                                {/* {location.state.fromEdit === true ?
                                    (<ButtonColored
                                        className="update-btn"
                                        label={t('update')}
                                        onClick={handleUpdateForm} />) :
                                    (<ButtonColored
                                        className="update-btn"
                                        isDisabled={ispublicBtnClick}
                                        label={t('publish')}
                                        onClick={handleSaveForm} />
                                    )} */}

                            </div>
                        </div >
                    ) : (
                        <div>


                            <div className="row nav-container  m-0 ">
                                <div className="col m-0 p-0">
                                    <div className='d-flex align-items-center your-library-container' onClick={backToDashboard}>
                                        <img src={chevronLeft} className='chevron-left' />
                                        <p className='back-your-library'> Figma Links</p>
                                    </div>
                                </div>
                                <div className="col m-0 p-0 ">
                                    <div className='switch-container'>
                                        <div container="preview-switch-container">
                                            <h1 className='preview-switch-header'>{t('preview')}</h1>
                                            <div className='switch-container'>
                                                <p className='desktop-mobile-label'>{t('desktop')}</p>
                                                <div className='container'>
                                                    <Form.Check
                                                        className='form-switch'
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
                                            label={t('update')}
                                            onClick={saveFigmaUrl} />
                                        {/* <ButtonClear
                                            className="save-as-draft"
                                            label={t('save-as-draft')}
                                            isDisabled={isSaveAsDraftBtnClick}
                                            onClick={location.state.fromEdit === true ?
                                                handleUpdateFormAsDraft :
                                                handleSaveFormAsDraft} /> */}
                                        {/* {location.state.fromEdit === true ?
                                            (<ButtonColored
                                                className="update-btn"
                                                label={t('update')}
                                                onClick={handleUpdateForm} />) :
                                            (<ButtonColored
                                                className="update-btn"
                                                isDisabled={ispublicBtnClick}
                                                label={t('publish')}
                                                onClick={handleSaveForm} />
                                            )} */}
                                    </div >
                                </div>
                            </div>

                            <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />
                            <iframe
                                src={isMobile ? editUrl(mobile) : editUrl(desktop)}
                                allowFullScreen
                                referrerpolicy="no-referrer"
                                style={{ width: '100%', height: '100vh' }}
                                className='figma_view'></iframe>
                        </div >
                    )
                    }
                </div>
            )
            }
        </>
    );
};

