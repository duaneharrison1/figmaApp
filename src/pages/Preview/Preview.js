import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, addDoc, doc, getDocs, updateDoc, QuerySnapshot, query, where } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { signOut } from "firebase/auth";
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import AlertModal from '../../components/AlertModal/AlertModal';
import axios from "axios";
import './Preview.css';
import firebase from '../../firebase';
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
    const [mobile, setMobile] = useState("");
    const [desktop, setDesktop] = useState("");
    const dbFirestore = firebase.firestore();

    const [postData, setPostData] = useState({
        // Define the data you want to send in the POST request
        "name": location.state.domain
    });
    const [newCustomDomainData, setNewCustomDomainData] = useState({
        // Define the data you want to send in the POST request
        "name": location.state.newCustomDomain
    });
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 83YzDqNvO4OoVtKXQXJ4mTyj'
    };

    const addDomainToVercel = async () => {
        try {
            const response = await axios.post(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                postData, {
                headers: headers,
            }).then((response) => {
                console.log(response.data)
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
    };




    // Make the POST request with headers
    // const response = await axios.post('https://api.example.com/post-endpoint', postData, {
    //     headers: headers,
    // });
    // const response = await fetch(
    //     `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
    //     {
    //       body: `{\n  "name": "${domain}"\n}`,
    //       headers: {
    //         Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
    //         'Content-Type': 'application/json',
    //       },
    //       method: 'POST',
    //     }
    //   )


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

    console.log("mobile " + mobile)
    console.log("desktop " + desktop)
    console.log("isMobile " + isMobile)

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


    const handleDraft = async (event) => {
        try {
            const docRef = await dbFirestore.collection('user').doc(user.uid).collection
                ("url").add({
                    title: location.state.title,
                    customDomain: location.state.domain,
                    isDraft: "true",
                    generatedUrl: randomurl,
                    urls: {
                        figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                        figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                    },
                    createdAt: new Date(),
                }).then(() => {
                    const docRef2 = dbFirestore.collection('url').add({
                        title: location.state.title,
                        customDomain: location.state.domain,
                        isDraft: "true",
                        generatedUrl: randomurl,
                        urls: {
                            figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                            figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                        },
                        createdAt: new Date(),
                    }).then(() => {
                        setShowModal(true);
                        setModalMessage("Added to draft")
                    })
                })
        } catch (err) {
            alert(err.message)
            console.log("error")
        }
    }

    const handleDeleteDomain = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 83YzDqNvO4OoVtKXQXJ4mTyj'
            };

            const response = await axios.delete(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains/${location.state.domain}?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                {
                    headers: headers,
                }).then((response) => {
                    alert("successful removing ")
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
                console.log(response.data)
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

            const response = await axios.delete(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains/${location.state.domain}?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
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

    const handleUpdateForEdit = async (event) => {
        event.preventDefault();

        try {
            const ref = doc(db, "user", user.uid, "url", location.state.docId)
            await updateDoc(ref, {
                title: location.state.title,
                customDomain: location.state.newCustomDomain,
                isDraft: "false",
                urls: {
                    figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                    figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                },
                updatedAt: new Date()
            });
            const q = query(collection(db, "url"), where("generatedUrl", "==", location.state.generatedUrl));
            const querySnapshot = await getDocs(q);
            if (!q.empty) {
                querySnapshot.forEach((document) => {
                    const docRef = doc(db, "url", document.id)
                    updateDoc(docRef, {
                        title: location.state.title,
                        customDomain: location.state.newCustomDomain,
                        isDraft: "false",
                        urls: {
                            figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                            figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                        },
                        updatedAt: new Date()
                    });
                });
            }

            if (location.state.newCustomDomain == "" && location.state.domain != "") {
                handleDeleteDomain()
                console.log("wentHerev0")
            } else if (location.state.newCustomDomain != "" && location.state.domain != location.state.newCustomDomain) {
                if (location.state.domain == "") {
                    addDomainToVercel()
                    console.log("wentHerev1")
                } else {
                    handleDeleteAndUpdateDomain()
                    console.log("wentHerev2")
                }

            } else {
                if (location.state.isDraft == 'false') {
                    window.open('https://figmafolio.com/' + location.state.generatedUrl, '_blank');
                }
            }


        } catch (error) {
            setShowModal(true);
            setModalMessage("Error updating")
            console.error('Error updating document:', error);
        }
    };



    const handleDraftForEdit = async (event) => {
        console.log("handleUpdateToDraft")
        event.preventDefault();
        try {
            const ref = doc(db, "user", user.uid, "url", location.state.docId)
            await updateDoc(ref, {
                title: location.state.title,
                customDomain: location.state.newCustomDomain,
                isDraft: "true",
                urls: {
                    figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                    figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                },
                updatedAt: new Date()
            });
            const q = query(collection(db, "url"), where("generatedUrl", "==", location.state.generatedUrl));
            const querySnapshot = await getDocs(q);
            if (!q.empty) {
                querySnapshot.forEach((document) => {
                    const docRef = doc(db, "url", document.id)
                    updateDoc(docRef, {
                        title: location.state.title,
                        customDomain: location.state.newCustomDomain,
                        isDraft: "true",
                        urls: {
                            figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                            figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                        },
                        updatedAt: new Date()
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

    const handleSaveForNewForm = async (e) => {
        e.preventDefault();
        try {
            const docRef = await dbFirestore.collection('user').doc(user.uid).collection
                ("url").add({
                    title: location.state.title,
                    customDomain: location.state.domain,
                    isDraft: "false",
                    generatedUrl: randomurl,
                    urls: {
                        figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                        figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                    },
                    createdAt: new Date(),
                }).then(() => {
                    const docRef2 = dbFirestore.collection('url').add({
                        title: location.state.title,
                        customDomain: location.state.domain,
                        isDraft: "false",
                        generatedUrl: randomurl,
                        urls: {
                            figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                            figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                        },
                        createdAt: new Date(),
                    })
                }
                )
            if (!location.state.domain == "") {
                addDomainToVercel()
            } else {
                window.open('https://figmafolio.com/' + randomurl, '_blank');
            }
        } catch (err) {
            alert(err.message)
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

                                if (value.generatedUrl != randomurl) {
                                } else {
                                    setDuplicate(true)
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
                                src={isMobile ? editUrl(mobile) : editUrl(desktop)}
                                allowFullScreen
                                style={{ width: '100%', height: '100vh' }}
                                className='figma_view'>
                            </iframe>

                            <div className='mobile-button-container'>

                                <ButtonClear className="save-as-draft" label='Save as Draft' onClick={location.state.fromEdit === true ? handleDraftForEdit : handleDraft} />

                                {location.state.fromEdit === true ? (
                                    <ButtonColored className="update-btn" label='Update' onClick={handleUpdateForEdit} />) :
                                    (
                                        <ButtonColored className="update-btn" label='Publish' onClick={handleSaveForNewForm} />
                                    )}

                            </div>
                        </div >
                    ) : (
                        <div>


                            <div className="row nav-container  m-0 ">
                                <div className="col m-0 p-0">
                                    <a className="back-to-library" href="/dashboard"> &lt; Back to dashboard</a>
                                </div>
                                <div className="col m-0 p-0 ">
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
                                <div className="col m-0 p-0">
                                    < div className='draft-publish-container'>
                                        <ButtonClear className="save-as-draft" label='Save as Draft' onClick={location.state.fromEdit === true ? handleDraftForEdit : handleDraft} />
                                        {location.state.fromEdit === true ? (
                                            <ButtonColored className="update-btn" label='Update' onClick={handleUpdateForEdit} />) :
                                            (
                                                <ButtonColored className="update-btn" label='Publish' onClick={handleSaveForNewForm} />
                                            )}
                                    </div >
                                </div>
                            </div>

                            <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />
                            <iframe
                                src={isMobile ? editUrl(mobile) : editUrl(desktop)}
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

