import React, { useState, useEffect } from 'react';
import { collection, addDoc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { signOut } from "firebase/auth";
import { useNavigate, useParams, Link } from 'react-router-dom';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import stepThree from './../../assets/images/stepThree.png';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import './ProfilePage.css'
import Navbar from '../../components/NavBar/Navbar';
import ChangePasswordModal from '../../components/ChangePasswordModal/ChangePasswordModal';
import SuccessModal from '../../components/SuccessModal/SuccessModal';

export default function ProfilePage() {
    const navigate = useNavigate();
    const user = auth.currentUser;
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showUploadImageModal, setShowUploadImageModal] = useState(false);
    const [showSuccessModal, setshowSuccessModal] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];
        setImage(selectedImage);
    };

    const handleUpload = () => {
        if (image) {
            // // Create a Firebase Storage reference for the image
            // const storageRef = firebase.storage().ref();
            // const imageRef = storageRef.child('images/${image.name}');

            // // Upload the selected image to Firebase Storage
            // imageRef.put(image).then(() => {
            //     console.log('Image uploaded successfully.');
            // });
        } else {
            console.log('No image selected for upload.');
        }
    };

    const handleShowUploadImage = () => {
        setShowUploadImageModal(true);
        // 
    };

    const handleShowModal = () => {
        setShowChangePasswordModal(true);
        // 
    };

    const handleCloseModal = () => {
        setShowChangePasswordModal(false);
    };

    const handleShowSuccessModal = () => {
        setShowChangePasswordModal(false);
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
            <div className='container main-profile-container'>
                <div className="row">
                    <div className="col-4">
                        <div className="profile-img-container">
                            <div className="outer">
                                <div className="inner" onClick={handleShowUploadImage}>
                                    {/* <input class="inputfile" type="file" name="pic" accept="image/*" /> */}
                                    <label>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 20.0002H21M3 20.0002H4.67454C5.16372 20.0002 5.40832 20.0002 5.63849 19.945C5.84256 19.896 6.03765 19.8152 6.2166 19.7055C6.41843 19.5818 6.59138 19.4089 6.93729 19.063L19.5 6.50023C20.3285 5.6718 20.3285 4.32865 19.5 3.50023C18.6716 2.6718 17.3285 2.6718 16.5 3.50023L3.93726 16.063C3.59136 16.4089 3.4184 16.5818 3.29472 16.7837C3.18506 16.9626 3.10425 17.1577 3.05526 17.3618C3 17.5919 3 17.8365 3 18.3257V20.0002Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-8">
                        <div className='profile-card'>
                            <div className='container-personal-information'>
                                <div className='container'>
                                    <h1 className='profile-headers'> Personal Information</h1>
                                </div>
                                <div className='container profile-buttons-container'>
                                    <ButtonColored label='Edit' className="edit-cancel-save-btn" />
                                    <ButtonColored label='Edit' className="edit-cancel-save-btn" />
                                    {/* <ButtonColored label='Cancel' className="new-site" />
                                    <ButtonClear label='Save' className="change-password" /> */}
                                </div>

                            </div>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-sm-6'>
                                        <h1 className='profile-sub-headers'>Name</h1>
                                        <h1 className='profile-values'>Duane</h1>
                                    </div>
                                    <div className='col-sm-6'>
                                        <h1 className='profile-sub-headers'>Email</h1>
                                        <h1 className='profile-values' >duane@gmail.com</h1>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className='security-container'>
                            <h1 className='profile-headers'> Security</h1>
                            <ButtonClear label='Change password' className="change-password" onClick={handleShowModal} />
                        </div>

                        <ChangePasswordModal show={showChangePasswordModal} handleClose={handleShowSuccessModal} />
                        <SuccessModal show={showSuccessModal} handleClose={handleCloseModal} />
                        <showUploadImageModal show={showUploadImageModal} />
                    </div>
                </div>
            </div>

        </>

    );
};

