import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, addDoc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { toast } from 'react-toastify';
import Alert from "react-bootstrap/Alert";
import Button from '../../components/Button/Button';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import Navbar from '../../components/NavBar/Navbar';
import Form from 'react-bootstrap/Form';

export default function Preview() {
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const userId = auth.currentUser;
    const [user, setUser] = useState(null);

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
            // addDoc(refAllUrl, urlData)
            console.log("Successful entry")

        } catch (err) {
            console.log(err)
        }
    }

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
                figmaDesktopUrl: location.state.figmaDesktopUrl,
                figmaMobileUrl: location.state.figmaMobileUrl
            }
        }

        try {
            addDoc(ref, urlData)
            addDoc(refAllUrl, urlData)
            console.log("Successful entry")
            // window.open('https://thriving-chaja-a2ee84.netlify.app/' + randomUrl, '_blank');
            // <Alert variant="success" style={{ width: "42rem" }}>
            //     <Alert.Heading>
            //         This is a success alert which has green background
            //     </Alert.Heading>
            // </Alert>
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
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
                                <div className='col-6'><Button label='Publish' onClick={handleSave} /></div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <iframe
                src={isMobile ? location.state.figmaMobileUrl : location.state.figmaDesktopUrl}
                allowFullScreen
                style={{ width: '100%', height: '100vh' }}
                className='figma_view'></iframe>

        </>
    );
};

