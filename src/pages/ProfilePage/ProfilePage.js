import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { signOut } from "firebase/auth";
import { useNavigate, useParams, Link } from 'react-router-dom';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import { InfoCircle } from 'react-bootstrap-icons';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import './ProfilePage.css'
import Navbar from '../../components/NavBar/Navbar';
import ChangePasswordModal from '../../components/ChangePasswordModal/ChangePasswordModal';
import SuccessModal from '../../components/SuccessModal/SuccessModal';

export default function ProfilePage() {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showSuccessModal, setshowSuccessModal] = useState(false);

    const handleShowModal = () => {
        setShowChangePasswordModal(true);
        // 
    };

    const handleCloseModal = () => {
        setShowChangePasswordModal(false);
        setshowSuccessModal(true);
    };

    const handleShowSuccessModal = () => {
        setShowChangePasswordModal(false);
        setshowSuccessModal(true);
    };

    const handleSuccessCloseModal = () => {
        setshowSuccessModal(false);
    };

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <>
            <Navbar onClickLogout={handleLogout} isFromForm={false} />
            <div className='container'>
                <div class="row">
                    <div class="col-4">
                        3 of 3
                    </div>
                    <div class="col-8">
                        <div className='profile-card'>
                            <h1> Personal Information</h1>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-sm-6'>
                                        <h1>Name</h1>
                                        <h1>Duane</h1>
                                    </div>
                                    <div className='col-sm-6'>
                                        <h1>Email</h1>
                                        <h1>duane@gmail.com</h1>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='profile-card'>
                            <ButtonClear label='Change password' className="upgrade-plan" onClick={handleShowModal} />
                            <ChangePasswordModal show={showChangePasswordModal} handleClose={handleShowSuccessModal} />
                            <SuccessModal show={showSuccessModal} handleClose={handleCloseModal} />
                        </div>
                    </div>
                </div>
            </div>

        </>

    );
};

