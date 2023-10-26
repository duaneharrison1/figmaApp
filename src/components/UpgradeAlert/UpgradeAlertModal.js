
import React, { useState } from 'react';
import './UpgradeAlertModal.css';
import { Modal } from 'react-bootstrap';

import ButtonColored from '../ButtonColored/ButtonColored';
import ButtonClear from '../ButtonClear/ButtonClear';
import { db, auth } from '../../firebase';
import { collection, addDoc, doc, getDocs, updateDoc, QuerySnapshot, query, where } from 'firebase/firestore'
const UpgradeAlertModal = (props) => {
    const { show, handleClose } = props;
    const user = auth.currentUser;
    const [isSuccessful, setIsSuccessful] = useState(false);
    const handleNotifyMe = async (event) => {
        event.preventDefault();
        const ref = collection(db, "notifyUpgrade", user.uid, "email")
        const data = { email: user.email }
        const usersRef = collection(db, "notifyUpgrade", user.uid, "email")
        await getDocs(collection(db, "notifyUpgrade", user.uid, "email"))
            .then((querySnapshot) => {
                if (querySnapshot.size == 0) {
                    console.log("not null")
                    try {
                        addDoc(ref, data)
                        setIsSuccessful(true)
                        console.log("successful")
                        console.log(isSuccessful)
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    setIsSuccessful(true)
                    console.log("null")
                    console.log(isSuccessful)
                }

            })

    };

    return (
        <>



            {isSuccessful ? (
                <Modal className='upgrade-modal' show={show} onHide={handleClose}>
                    <Modal.Body className='modal-body'>
                        <h1 className='upgrade-header'> Thanks for your patience!</h1>
                        <h2 className='upgrade-subheader'> We'll send an email as soon as custom domains is live.</h2>
                        <ButtonColored className="btn-notify-me" label="Okay" onClick={handleClose} />
                    </Modal.Body >
                </Modal >
            ) : (
                <Modal className='upgrade-modal' show={show} onHide={handleClose}>
                    <Modal.Body className='modal-body'>
                        <h1 className='upgrade-header'> We’re very sorry, this feature is not ready yet</h1>
                        <h2 className='upgrade-subheader'> This feature will be available in an upcoming update. Do you want to be notified when this feature is available?</h2>
                        <ButtonColored className="btn-notify-me" label="Notify Me" onClick={handleNotifyMe} />
                        <ButtonClear className="btn-cancel" onClick={handleClose} label="Cancel" />
                    </Modal.Body>
                </Modal >
            )}
        </>
    );
};

export default UpgradeAlertModal;