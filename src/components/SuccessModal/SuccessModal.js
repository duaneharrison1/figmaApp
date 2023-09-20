
import React from 'react';
import './SuccessModal.css';
import { Modal } from 'react-bootstrap';
import { useNavigate, useParams, Link } from 'react-router-dom';
import SuccessCheck from '../../assets/images/success-check.png';
import { db, auth } from '../../firebase';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth';
import ButtonColored from '../ButtonColored/ButtonColored';
import ButtonClear from '../ButtonClear/ButtonClear';

const SuccessModal = (props) => {
    const { show, handleClose } = props;
    const [userId] = useAuthState(auth);
    const [user, setUser] = useState(null);
    const id = props.id;
    const navigate = useNavigate();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async () => {
        navigate("/");
        console.log("Signed out successfully")
    };

    return (
        <Modal className='delete-modal' show={show} onHide={handleClose}>
            <Modal.Body className='modal-body'>
                <img src={SuccessCheck} />
                <h1 className='delete-header'> Password successfully reset</h1>
                <h2 className='delete-subheader'> Please log in again</h2>

            </Modal.Body>
            <Modal.Footer>
                <div className='container'>
                    <ButtonColored className="btn-block" onClick={handleDelete} label="Login now" />
                </div>
            </Modal.Footer >
        </Modal >
    );
};

export default SuccessModal;
