import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDocs, updateDoc, QuerySnapshot, query, where } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { signOut } from "firebase/auth";
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import AlertModal from '../../components/AlertModal/AlertModal';

import './Preview.css';
export default function Preview() {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const userId = auth.currentUser;

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [duplicate, setDuplicate] = useState('');
    const [randomurl, setRandomUrl] = useState('');
    const [user, setUser] = useState(null);

    const [userIsDesktop, setUserIsDesktop] = useState(true);
    useEffect(() => {
        window.innerWidth > 1280 ? setUserIsDesktop(true) : setUserIsDesktop(false);
    }, [userIsDesktop]);


    console.log("wewewew" + location.state.figmaDesktopUrl)
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Set the user state
        });

        return () => unsubscribe(); // Clean up the listener when component unmounts
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
            console.log("wentherev1")
            if (!modifiedString.includes(embedHost)) {
                newUrl = "https://" + embedHost + modifiedString
                console.log("wentherev1")
            } else {
                newUrl = url;
            }

            if (!newUrl.includes(hideUi)) {
                newUrl += hideUi
                console.log("wentherev2")
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
                modifiedUrl = newUrl.replace(new RegExp("scaling=scale-down", 'g'), "scaling=scale-down-width");
                newUrl = modifiedUrl
            }

        } else {
            newUrl = ""
        }

        return newUrl
    }
    console.log("wwww" + editUrl(location.state.figmaDesktopUrl))
    console.log("wwww1" + editUrl(location.state.figmaMobileUrl))

    const handleDraft = async (event) => {
        event.preventDefault();
        const ref = collection(db, "user", userId.uid, "url")
        const refAllUrl = collection(db, "url")
        let urlData = {
            title: location.state.title,
            isDraft: "true",
            urls: {
                figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
            }
        }

        try {
            addDoc(ref, urlData)
            setShowModal(true);
            setModalMessage("Added to draft")

        } catch (err) {
            console.log(err)
            setShowModal(true);
            setModalMessage("Error")
        }
    }

    const handleUpdate = async (event) => {
        event.preventDefault();
        try {
            const ref = doc(db, "user", user.uid, "url", location.state.docId)
            await updateDoc(ref, {
                title: location.state.title,
                urls: {
                    figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                    figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                }
            });
            const q = query(collection(db, "url"), where("generatedUrl", "==", location.state.generatedUrl));
            const querySnapshot = await getDocs(q);


            if (!q.empty) {
                querySnapshot.forEach((document) => {
                    console.log(document.id, " => ", document.data());
                    const docRef = doc(db, "url", document.id)
                    updateDoc(docRef, {
                        title: location.state.title,
                        urls: {
                            figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                            figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                        }
                    });
                });

            }

            setShowModal(true);
            setModalMessage("Update successful")
            console.log('Document updated successfully');
            if (location.state.isDraft == 'false') {
                window.open('https://figmafolio.com/' + location.state.generatedUrl, '_blank');
            }
        } catch (error) {
            setShowModal(true);
            setModalMessage("Error updating")
            console.error('Error updating document:', error);
        }
    };

    const handleSaveV2 = async (e) => {
        e.preventDefault();
        console.log(editUrl(location.state.figmaDesktopUrl))
        const ref = collection(db, "user", userId.uid, "url")
        const refAllUrl = collection(db, "url")

        let urlData = {
            title: location.state.title,
            isDraft: "false",
            generatedUrl: randomurl,
            urls: {
                figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
            }
        }

        try {
            addDoc(ref, urlData)
            addDoc(refAllUrl, urlData)
            setShowModal(true);
            setModalMessage("App saved")
            window.open('https://figmafolio.com/' + randomurl, '_blank');
        } catch (err) {
            console.log(err)
            setShowModal(true);
            setModalMessage("Error in saving")
        }
    }


    useEffect(() => {
        setRandomUrl(generateRandomString(10))
        const fetchData = async () => {
            if (user) {
                try {
                    await getDocs(collection(db, "url"))
                        .then((querySnapshot) => {
                            const newData = querySnapshot.docs
                                .map((doc) => ({ ...doc.data(), id: doc.id }));
                            newData.forEach((value) => {
                                console.log(value.generatedUrl)
                                if (value.generatedUrl != randomurl) {
                                    console.log("not exists");

                                } else {
                                    setDuplicate(true)
                                    console.log(randomurl);
                                    console.log("already exists");
                                }
                            });
                        })
                } catch (error) {
                    console.error("error" + error);
                }
            }
        };
        fetchData();
    }, [user]);


    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top of the page
    }, []);

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
                                        <a className="back-to-library" href="/dashboard"> &lt; Back to dashboard</a>
                                    </div>
                                    <div className="col m-0 p-0">
                                        <div className='switch-container'>
                                            <p className='desktop-mobile-label'>Desktop</p>
                                            <div className='form-switch-container'>
                                                <Form.Check
                                                    className='form-switch'
                                                    type="switch"
                                                    id="custom-switch"
                                                    checked={isMobile}
                                                    onChange={handleSwitchChange}
                                                />
                                            </div>
                                            <p className='desktop-mobile-label'> Mobile</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />
                            <iframe
                                src={isMobile ? editUrl(location.state.figmaMobileUrl) : editUrl(location.state.figmaDesktopUrl)}
                                allowFullScreen
                                style={{ width: '100%', height: '100vh' }}
                                className='figma_view'>
                            </iframe>

                            <div className='mobile-button-container'>

                                <ButtonClear className="save-as-draft" label='Save as Draft' onClick={location.state.fromEdit === true ? handleUpdate : handleDraft} />

                                {location.state.fromEdit === true ? (
                                    <ButtonColored className="update-btn" label='Update' onClick={handleUpdate} />) :
                                    (
                                        <ButtonColored className="update-btn" label='Publish' onClick={handleSaveV2} />
                                    )}

                            </div>
                        </div >
                    ) : (
                        <div>


                            <div class="row nav-container  m-0 ">
                                <div class="col m-0 p-0">
                                    <a className="back-to-library" href="/dashboard"> &lt; Back to dashboard</a>
                                </div>
                                <div class="col m-0 p-0 ">
                                    <div className='switch-container'>
                                        <div container="preview-switch-container">
                                            <h1 className='preview-switch-header'>Preview</h1>
                                            <div className='switch-container'>
                                                <p className='desktop-mobile-label'>Desktop</p>
                                                <div className='container'>
                                                    <Form.Check
                                                        className='form-switch'
                                                        type="switch"
                                                        id="custom-switch"
                                                        checked={isMobile}
                                                        onChange={handleSwitchChange}
                                                    />
                                                </div>
                                                <p className='desktop-mobile-label'> Mobile</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col m-0 p-0">
                                    < div className='draft-publish-container'>
                                        <ButtonClear className="save-as-draft" label='Save as Draft' onClick={location.state.fromEdit === true ? handleUpdate : handleDraft} />
                                        {location.state.fromEdit === true ? (
                                            <ButtonColored className="update-btn" label='Update' onClick={handleUpdate} />) :
                                            (
                                                <ButtonColored className="update-btn" label='Publish' onClick={handleSaveV2} />
                                            )}
                                    </div >
                                </div>
                            </div>

                            <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />
                            <iframe
                                src={isMobile ? editUrl(location.state.figmaMobileUrl) : editUrl(location.state.figmaDesktopUrl)}
                                allowFullScreen
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

