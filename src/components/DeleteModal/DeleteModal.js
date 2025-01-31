
import React from 'react';
import './DeleteModal.css';
import { Modal } from 'react-bootstrap';
import DeleteHeaderImage from '../../assets/images/delete-header-img.png';
import { db, useAuth } from '../../firebase';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc, query, where, getDoc } from 'firebase/firestore'
import { ref, deleteObject, getStorage } from "firebase/storage";
import { useAuthState } from 'react-firebase-hooks/auth';
import ButtonColored from '../ButtonColored/ButtonColored';
import ButtonClear from '../ButtonClear/ButtonClear';
import axios from "axios";
import { useTranslation } from 'react-i18next';
const DeleteModal = (props) => {
    const { t } = useTranslation();
    const { show, handleClose } = props;
    const user = useAuth();
    const id = props.id;
    const faviconUrl = props.faviconUrl ?? '';
    const [outputValue, setOutputValue] = useState('');

    useEffect(() => {
        async function updateDomain() {
            const regex = /^(https?:\/\/|www\.) /i;
            if (regex.test(props.customDomain)) {
                const removedPrefix = props.customDomain.replace(regex, '');
                setOutputValue(removedPrefix);
            } else {
                setOutputValue(props.customDomain);
            }
        }
        updateDomain();
    }, [props.customDomain]);



    const handleDeleteDomainAndData = async () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 83YzDqNvO4OoVtKXQXJ4mTyj'
            };
    
            const response = await axios.delete(
                `https://api.vercel.com/v9/projects/${process.env.REACT_APP_VERCEL_PROJECT_ID}/domains/${outputValue}?teamId=${process.env.REACT_APP_VERCEL_TEAM_ID}`,
                { headers }
            );
    
            // Proceed to delete data from Firestore and Storage
            await dataInDb();
        } catch (error) {
            console.error("Error deleting domain: ", error);
            alert("Error Deleting domain");
        }
    }
    
    const dataInDb = async () => {
        try {
            if (faviconUrl !== '') {
                const storage = getStorage();
                const desertRef = ref(storage, faviconUrl);
                await deleteObject(desertRef);
                console.log("Favicon deleted successfully");
            }
            
            await deleteDoc(doc(db, "user", user.uid, "url", id));
            await deleteDoc(doc(db, "user", user.uid, "customDomain", props.customDomain));
            
            console.log("Firestore documents deleted successfully");
            window.location.reload();
            handleClose();
        } catch (e) {
            console.error("Error deleting data from Firestore: ", e);
            alert("Error Deleting data from Firestore");
            throw e; // Re-throw the error to propagate it up
        }
    }
    
    const handleDelete = async () => {
        try {
            console.log("Starting deletion process...");
            
            if (props.customDomain === '' || props.customDomain === undefined) {
                console.log("No custom domain, proceeding to delete data from Firestore and Storage.");
                await dataInDb();
            } else {
                console.log("Custom domain provided, deleting domain data first.");
                await handleDeleteDomainAndData();
            }
        } catch (error) {
            console.error('Error in deletion process: ', error);
            alert("Error Deleting data");
        }
    };
    

    return (
        <Modal className='delete-modal' show={show} onHide={handleClose}>
            <Modal.Body className='modal-body'>
                <img src={DeleteHeaderImage} />
                <h1 className='delete-header'>{t('delete-site')}</h1>
                <h2 className='delete-subheader'> {t('once-being-deleted')}</h2>
            </Modal.Body>
            <Modal.Footer>
                <div className='container'>
                    <ButtonColored className="delete-btn" onClick={handleDelete} label={t('delete')} />
                </div>

                <div className='container'>
                    <ButtonClear className="cancel-delete-btn" onClick={handleClose} label={t('cancel')} />
                </div>
            </Modal.Footer >
        </Modal >
    );
};

export default DeleteModal;