
import React from 'react';
import './DeleteModal.css';
import { Modal } from 'react-bootstrap';
import DeleteHeaderImage from '../../assets/images/delete-header-img.png';
import { db, auth } from '../../firebase';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc, query, where } from 'firebase/firestore'

import { useAuthState } from 'react-firebase-hooks/auth';
import ButtonColored from '../ButtonColored/ButtonColored';
import ButtonClear from '../ButtonClear/ButtonClear';

const DeleteModal = (props) => {
    const { show, handleClose } = props;
    const [userId] = useAuthState(auth);
    const [user, setUser] = useState(null);
    const id = props.id;
    const generatedUrl = props.generatedUrl;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "user", user.uid, "url", id));
            const q = query(collection(db, "url"), where("generatedUrl", "==", generatedUrl));
            const querySnapshot = await getDocs(q);
            try {
                if (!q.empty) {
                    querySnapshot.forEach((document) => {
                        deleteDoc(doc(db, "url", document.id));
                    });
                    console.log('Document successfully deleted!');
                    window.location.reload();
                }
            } catch (error) {
                console.error('Error removing document: ', error);
            }
        } catch (error) {
            console.error('Error removing document: ', error);
        }
    };

    return (
        <Modal className='delete-modal' show={show} onHide={handleClose}>
            <Modal.Body className='modal-body'>
                <img src={DeleteHeaderImage} />
                <h1 className='delete-header'> Delete site</h1>
                <h2 className='delete-subheader'> Once being deleted, this file cannot be recover. Are you sure?</h2>

            </Modal.Body>
            <Modal.Footer>
                <div className='container'>
                    <ButtonColored className="delete-btn" onClick={handleDelete} label="Delete" />
                </div>

                <div className='container'>
                    <ButtonClear className="cancel-delete-btn" onClick={handleClose} label="Cancel" />


                </div>



            </Modal.Footer >
        </Modal >
    );
};

export default DeleteModal;
