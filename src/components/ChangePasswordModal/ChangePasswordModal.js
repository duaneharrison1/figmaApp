
import React from 'react';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { Modal } from 'react-bootstrap';
import { db, auth } from '../../firebase';
import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth";
import ButtonColored from '../ButtonColored/ButtonColored';
import TextField from '../../components/TextField/TextField.js';
import './ChangePasswordModal.css'
import SuccessCheck from '../../assets/images/success-check.png';
import { NavLink, useNavigate, Link } from 'react-router-dom';

const ChangePasswordModal = (props) => {
    const { show, handleClose } = props;
    const [user, setUser] = useState(null);
    const [isChangePasswordSuccessful, setIsChangePasswordSuccessful] = useState(false);
    const [errorPassword, setErrorPassword] = useState(null);
    const [errorFirebase, setErrorFirebase] = useState(null);
    const id = props.id;
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const isButtonActive = password && newPassword && confirmNewPassword;

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

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handlePasswordChange = (password) => {
        setPassword(password);
    };

    const handleNewPasswordChange = (newPassword) => {
        setNewPassword(newPassword);
    };

    const handleConfirmNewPasswordChange = (confirmNewPassword) => {
        setConfirmNewPassword(confirmNewPassword);
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;
        if (newPassword != confirmNewPassword) {
            setErrorPassword("Reenter password does not match");

        } else {
            try {
                const credential = EmailAuthProvider.credential(
                    user.email,
                    password
                )

                try {
                    await reauthenticateWithCredential(user, credential)
                    await updatePassword(user, confirmNewPassword);
                    signOut(auth).then(() => {
                        setIsChangePasswordSuccessful(true)
                        console.log("Signed out successfully")
                    }).catch((error) => {
                        // An error happened.
                    });
                    console.log("successfull change")
                } catch (error) {
                    console.log(error.message);

                    if (error.message == "Firebase: Error (auth/wrong-password).") {
                        setErrorFirebase("Wrong password");
                    } else {
                        setErrorFirebase(error.message);
                    }

                }

            } catch (error) {

            }
        }
    }


    return (
        <>
            {isChangePasswordSuccessful ? (
                <Modal className='delete-modal' show={show} onHide={handleClose}>
                    <Modal.Body className='modal-body'>
                        <img src={SuccessCheck} />
                        <h1 className='delete-header'> Password successfully reset</h1>
                        <h2 className='delete-subheader'> Please log in again</h2>
                        <ButtonColored className="btn-block" onClick={handleDelete} label="Login now" />
                    </Modal.Body>
                </Modal >
            ) : (
                < Modal className='changepassword-modal' show={show} onHide={handleClose} >
                    <Modal.Body className='modal-body' >
                        <h1 className='delete-header'>Change password</h1 >
                        <TextField
                            formLabel='Current Password'
                            className='input'
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your current password"
                            onChange={handlePasswordChange} />

                        {errorFirebase && < p className='error-message'>{errorFirebase}</p>}

                        <TextField
                            formLabel='New password'
                            className='input'
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create your new password"
                            onChange={handleNewPasswordChange} />

                        <TextField
                            formLabel='Verify new password'
                            className='input'
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Verify your new password"
                            onChange={handleConfirmNewPasswordChange} />
                        {errorPassword && < p className='error-message'>{errorPassword}</p>}
                        {
                            isButtonActive ?
                                <ButtonColored
                                    label='Change password'
                                    className="btn-changepassword"
                                    onClick={handleChangePassword}
                                />
                                :
                                <ButtonColored
                                    className="disabled-btn-changepassword"
                                    label='Change password'
                                    disabled
                                />
                        }
                    </Modal.Body >
                </Modal >
            )}

        </>



    )
};

export default ChangePasswordModal;
