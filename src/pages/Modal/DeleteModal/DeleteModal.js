// ModalComponent.js
import React from 'react';
import './DeleteModal.css';
import { Modal, Button } from 'react-bootstrap';
import DeleteHeaderImage from '../../../assets/images/delete-header-img.png';
import { db, auth } from '../../../firebase';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth';

const DeleteModal = (props) => {
    const { show, handleClose } = props;
    const [userId] = useAuthState(auth);
    const [user, setUser] = useState(null);
    const id = props.id;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Set the user state
        });

        return () => unsubscribe(); // Clean up the listener when component unmounts
    }, []);

    const handleDelete = async () => {
        console.log("wew");
        console.log(id);
        try {
            await deleteDoc(doc(db, "user", user.uid, "url", id));
            console.log('Document successfully deleted!');
        } catch (error) {
            console.error('Error removing document: ', error);
        }
    };

    return (

        <Modal className='delete-modal' show={show} onHide={handleClose}>
            <Modal.Body className='modal-body'>
                <img src={DeleteHeaderImage} />
                <h1> Delete site</h1>
                <h2> Once being deleted, this file cannot be recover. Are you sure?</h2>

            </Modal.Body>
            <Modal.Footer>
                <div className='container'>
                    <button onClick={handleDelete}>
                        Delete
                    </button>
                </div>

                <div className='container'>
                    <button onClick={handleClose}>
                        Cancel
                    </button>
                </div>



            </Modal.Footer >
        </Modal >
    );
};

export default DeleteModal;
