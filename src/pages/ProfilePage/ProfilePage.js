import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth, useAuth } from '../../firebase';
import { signOut } from "firebase/auth";
import { useNavigate, useParams, Link } from 'react-router-dom';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import stepThree from './../../assets/images/stepThree.png';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import './ProfilePage.css'
import Navbar from '../../components/NavBar/Navbar';
import ChangePasswordModal from '../../components/ChangePasswordModal/ChangePasswordModal';
import SuccessModal from '../../components/SuccessModal/SuccessModal';
import UploadImage from '../../components/UploadImage/UploadImage';
import ProfileIcon from '../../assets/images/profileicon.png'

export default function ProfilePage() {
    const navigate = useNavigate();
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [showUploadImageModal, setShowUploadImageModal] = useState(false);
    const [showSuccessModal, setshowSuccessModal] = useState(false);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState([]);
    const [photoURL, setPhotoURL] = useState();
    const currentUser = useAuth();

    const userEmail = auth.currentUser;
    useEffect(() => {
        if (currentUser?.photoURL) {
            setPhotoURL(currentUser.photoURL);
        }
    }, [currentUser])


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    await getDocs(collection(db, "user", user.uid, "profile"))
                        .then((querySnapshot) => {
                            const userProfile = querySnapshot.docs
                                .map((doc) => ({ ...doc.data(), id: doc.id }));
                            setProfile(userProfile);
                        })
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            else {
            }
        };
        fetchData();
    }, [user, profile]);

    const handleUpload = () => {
        setShowUploadImageModal(true);
    };

    const handleShowModal = () => {
        setShowChangePasswordModal(true);
    };

    const handleCloseModal = () => {
        setShowChangePasswordModal(false);
    };

    const handleShowSuccessModal = () => {
        setShowChangePasswordModal(false);
    };

    return (
        <>
            {!profile ?
                < Navbar className={"dashboardNavBar"} email={" "} isFromForm={"false"} />
                :
                <div>
                    {profile.map(profile => (
                        < Navbar className={"dashboardNavBar"} email={profile.name} isFromForm={"false"} />
                    ))}
                </div>
            }

            <div className='container main-profile-container'>
                <div className="row">
                    <div className="col-4">
                        <div className="profile-img-container">
                            <div className="outer" style={{ backgroundImage: `url(${!photoURL ? ProfileIcon : photoURL})` }}>
                                <div className="inner" onClick={handleUpload}>
                                    <label>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 20.0002H21M3 20.0002H4.67454C5.16372 20.0002 5.40832 20.0002 5.63849 19.945C5.84256 19.896 6.03765 19.8152 6.2166 19.7055C6.41843 19.5818 6.59138 19.4089 6.93729 19.063L19.5 6.50023C20.3285 5.6718 20.3285 4.32865 19.5 3.50023C18.6716 2.6718 17.3285 2.6718 16.5 3.50023L3.93726 16.063C3.59136 16.4089 3.4184 16.5818 3.29472 16.7837C3.18506 16.9626 3.10425 17.1577 3.05526 17.3618C3 17.5919 3 17.8365 3 18.3257V20.0002Z" stroke="black" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
                        <div className='profile-card'>
                            <div className='container-personal-information'>
                                <div className='container'>
                                    <h1 className='profile-headers'> Personal Information</h1>
                                </div>
                                <div className='container profile-buttons-container'>
                                    <ButtonColored label='Edit' className="edit-cancel-save-btn" />
                                </div>

                            </div>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-sm-6'>
                                        <h1 className='profile-sub-headers'>Name</h1>
                                        {profile.map(profile => (
                                            <input
                                                className='form-input'
                                                type="text"
                                                placeholder='Custom Desktop Url'
                                                value={!profile ? "" : profile.name}
                                                disabled
                                            />
                                        ))}
                                    </div>
                                    <div className='col-sm-6'>
                                        <h1 className='profile-sub-headers'>Email</h1>
                                        <input
                                            className='form-input'
                                            type="text"
                                            placeholder='Custom Desktop Url'
                                            value={!userEmail ? "" : userEmail.email}
                                            disabled
                                        />
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
                        <UploadImage show={showUploadImageModal} />
                    </div>
                </div>
            </div>
        </>
    );
};

