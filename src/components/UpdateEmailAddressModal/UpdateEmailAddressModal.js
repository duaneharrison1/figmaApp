
import React from 'react';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateEmail } from "firebase/auth";
import { Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import ButtonColored from '../ButtonColored/ButtonColored';
import TextField from '../../components/TextField/TextField.js';
import '../ChangePasswordModal/ChangePasswordModal.css'
import SuccessCheck from '../../assets/images/success-check.png';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import PasswordTextField from '../PasswordTextfield/PasswordTextfield.js';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import { auth } from '../../firebase';
import firebase from '../../firebase';
import './UpdateEmailAddressModal.css'

const UpdateEmailAdressModal = (props) => {

    const dbFirestore = firebase.firestore();
    const [currentEmail, setCurrentEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(null);

    const handlePassword = (password) => {
        setPassword(password);
    };


    const handleCurrentEmail = (currentEmail) => {
        setCurrentEmail(currentEmail);
    };

    const handleNewEmail = (newEmail) => {
        setNewEmail(newEmail);
    };

    const handleChangeEmail = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;
        const credentials = EmailAuthProvider.credential(
            currentEmail,
            password
        )

        try {

            // Re-authenticate user with current email and password
            // await reauthenticateWithCredential(credentials);
            await reauthenticateWithCredential(user, credentials);
            // Update user's email address
            await updateEmail(user, newEmail);

            dbFirestore
                .collection('user')
                .doc(user.uid)
                .update({
                    email: newEmail,
                })
                .then(() => {
                    console.log('Document successfully written!');
                })
                .catch((error) => {
                    setErrorConfirmPassword(error.toString());
                    // console.error('Error writing document: ', error);
                });

            alert('Email updated successfully!');
        } catch (error) {
            console.log("xx" + error.message)
            if (error.message == "Firebase: Error (auth/user-mismatch).") {
                setErrorConfirmPassword("Invalid email address, please check your current email address");
            } else if (error.message == "Firebase: Error (auth/wrong-password).") {
                setErrorConfirmPassword("Your password is incorrect");
            } else if (error.message == "Firebase: Error (auth/email-already-in-use).") {
                setErrorConfirmPassword("Your new email address is already in use.");
            } else {
                setErrorConfirmPassword(error.message.toString());
            }

        }
    };


    const { show, handleClose } = props;
    const [isChangePasswordSuccessful, setIsChangePasswordSuccessful] = useState(false);
    const [errorPassword, setErrorPassword] = useState(null);
    const [errorFirebase, setErrorFirebase] = useState(null);
    const id = props.id;
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const isButtonActive = password && newPassword && confirmNewPassword;
    const { t } = useTranslation();
    const lng = navigator.language;

    const navigate = useNavigate();


    const handleDelete = async () => {
        navigate("/");
        console.log("Signed out successfully")
    };

    return (
        <>
            {isChangePasswordSuccessful ? (
                <Modal className='delete-modal' show={show} onHide={handleClose}>
                    <Modal.Body className='modal-body'>
                        <img src={SuccessCheck} />
                        <h1 className='delete-header'> {t('password-successfully-reset')}</h1>
                        <h2 className='delete-subheader'>{t('please-login-again')}</h2>
                        <ButtonColored className="btn-block" onClick={handleDelete} label={t('login-now')} />
                    </Modal.Body>
                </Modal >
            ) : (
                < Modal className='changepassword-modal' show={show} onHide={handleClose} >
                    <Modal.Body className='modal-body' >
                        <h1 className='delete-header'>Update Email Address</h1 >
                        <div className='email-input-holder'>
                            <TextField
                                formLabel="Current email"
                                className='auth-input'
                                id="email-address"
                                name="email"
                                required
                                placeholder="Enter your current email"
                                onChange={handleCurrentEmail} />

                        </div>

                        <PasswordTextField
                            formLabel={t('current-password')}
                            className='password-input'
                            id="password"
                            name="password"
                            type="password"
                            placeholder={t('enter-your-current-password')}
                            onChange={handlePassword} />

                        <div className='email-input-holder'>
                            <TextField
                                formLabel="New email"
                                className='auth-input'
                                id="email-address"
                                name="email"
                                required
                                placeholder="Enter your new email"
                                onChange={handleNewEmail} />
                        </div>
                        {errorConfirmPassword && < p className='error-message'>{errorConfirmPassword}</p>}
                        <ButtonColored label="Update Email" className="update-email" onClick={handleChangeEmail}>
                        </ButtonColored>

                    </Modal.Body >
                </Modal >
            )}

        </>
    )
};

export default UpdateEmailAdressModal;
