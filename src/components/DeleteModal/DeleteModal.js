
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
import axios from "axios";
const DeleteModal = (props) => {
    const { show, handleClose } = props;
    const [userId] = useAuthState(auth);
    const [user, setUser] = useState(null);
    const id = props.id;
    const customDomain = props.customDomain;
    const [outputValue, setOutputValue] = useState('');


    useEffect(() => {
        const regex = /^(https?:\/\/|www\.) /i;
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        if (regex.test(customDomain)) {
            const removedPrefix = customDomain.replace(regex, '');
            setOutputValue(removedPrefix);
        } else {
            setOutputValue(customDomain);
        }
        return () => unsubscribe();
    }, []);


    const handleDeleteDomainAndData = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 83YzDqNvO4OoVtKXQXJ4mTyj'
            };

            const response = await axios.delete(`https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains/${outputValue}?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                {
                    headers: headers,
                }).then((response) => {
                    dataInDb()
                }).catch((error) => {
                    alert(error)
                });
        } catch (error) {
            alert(error)
        }
    }

    const dataInDb = async () => {
        try {
            await deleteDoc(doc(db, "user", user.uid, "url", id));
            window.location.reload();
            handleClose()
        } catch {
            alert("Error Deleting data")
        }
    }

    const handleDelete = async () => {
        try {
            if (props.customDomain == '' || props.customDomain == undefined) {
                dataInDb()
            } else {
                handleDeleteDomainAndData()
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
