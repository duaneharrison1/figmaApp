import React, { useState, useEffect } from 'react';

import { useLocation } from 'react-router-dom';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { toast } from 'react-toastify';
import Alert from "react-bootstrap/Alert";
import Button from '../../components/Button/Button';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import Navbar from '../../components/NavBar/Navbar';
import Form from 'react-bootstrap/Form';
import AlertModal from '../../components/AlertModal/AlertModal';

export default function Preview() {
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const userId = auth.currentUser;
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const fromEdit = location.state.fromEdit;

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Set the user state
        });

        return () => unsubscribe(); // Clean up the listener when component unmounts
    }, []);


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
        // Create a regular expression to match the word with word boundaries
        const regex = new RegExp(`\\b${wordToRemove}\\b`, 'gi');

        // Use the replace method to remove all occurrences of the word
        const resultString = inputString.replace(regex, '');

        return resultString;
    }


    function editUrl(url) {
        const originalString = url;
        const wordToRemove = "https://";
        const modifiedString = removeWordFromString(originalString, wordToRemove);
        const newUrl = "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2F" + modifiedString + "&hide-ui=1"
        return newUrl
    }

    const handleDraft = async (event) => {
        event.preventDefault();
        const ref = collection(db, "user", userId.uid, "url")
        const refAllUrl = collection(db, "url")
        // var randomUrl = generateRandomString(6);
        let urlData = {
            title: location.state.title,
            isDraft: "true",
            urls: {
                figmaDesktopUrl: location.state.figmaDesktopUrl,
                figmaMobileUrl: location.state.figmaMobileUrl
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
        console.log(userId.uid);
        try {
            const ref = doc(db, "user", userId.uid, "url", location.state.docId)
            await updateDoc(ref, {
                title: location.state.title,
                urls: {
                    figmaDesktopUrl: editUrl(location.state.figmaDesktopUrl),
                    figmaMobileUrl: editUrl(location.state.figmaMobileUrl)
                }
            });
            setShowModal(true);
            setModalMessage("Update successful")
            console.log('Document updated successfully');
            window.open('https://lively-puffpuff-ffda96.netlify.app/' + location.state.generatedUrl, '_blank');

        } catch (error) {
            setShowModal(true);
            setModalMessage("Error updating")
            console.error('Error updating document:', error);
        }
    };

    const handleSave = async (event) => {
        event.preventDefault();
        const ref = collection(db, "user", userId.uid, "url")
        const refAllUrl = collection(db, "url")
        var randomUrl = generateRandomString(6);
        let urlData = {
            title: location.state.title,
            isDraft: "false",
            generatedUrl: randomUrl,
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
            window.open('https://lively-puffpuff-ffda96.netlify.app/' + randomUrl, '_blank');
        } catch (err) {
            console.log(err)
            setShowModal(true);
            setModalMessage("Error in saving")
        }
    }

    return (
        <>
            <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-4">
                        <h1>Figmafolio</h1>
                    </div>
                    <div className="col-md-4">
                        <div className='container'>
                            <p> Desktop</p>
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label="Toggle Switch"
                                checked={isMobile}
                                onChange={handleSwitchChange}
                            />
                            <p> Mobile</p>

                        </div>


                    </div>
                    <div className="col-md-4">
                        <div className='container'>
                            <div className='row'>
                                <div className='col-6'>  <ButtonClear label='Save as Draft' onClick={handleDraft} /></div>

                                <div className='col-6'>
                                    {fromEdit === true ? (
                                        <Button label='Update' onClick={handleUpdate} />) :
                                        (
                                            <Button label='Publish' onClick={handleSave} />
                                        )}
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <iframe
                src={isMobile ? editUrl(location.state.figmaMobileUrl) : editUrl(location.state.figmaDesktopUrl)}
                allowFullScreen
                style={{ width: '100%', height: '100vh' }}
                className='figma_view'></iframe>

        </>
    );
};

