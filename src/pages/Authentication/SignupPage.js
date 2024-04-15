import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase';
import './Auths.css';
import TextField from '../../components/TextField/TextField.js';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import AlertModal from '../../components/AlertModal/AlertModal';
import firebase from '../../firebase';
import PasswordTextField from '../../components/PasswordTextfield/PasswordTextfield.js';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
export default function SignupPage() {
    const navigate = useNavigate();
    const dbFirestore = firebase.firestore();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(null);
    const isButtonActive = email && password && confirmPassword;
    const { t } = useTranslation();
    const lng = navigator.language;

    useEffect(() => {

        i18n.changeLanguage(lng);
    }, [])

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleEmailChange = (email) => {
        setEmail(email);
    };

    const handleNameChange = (name) => {
        setName(name);
    };

    const handlePasswordChange = (password) => {
        setPassword(password);
    };


    const handleConfirmPasswordChange = (confirmPassword) => {
        setConfirmPassword(confirmPassword);
    };


    const onSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setConfirmPassword("Password not match");
        } else {
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    dbFirestore
                        .collection('user')
                        .doc(user.uid)
                        .set({
                            name: name,
                            email: user.email,
                        })
                        .then(() => {
                            console.log('Document successfully written!');
                        })
                        .catch((error) => {
                            console.error('Error writing document: ', error);
                        });
                    // try {

                    //     const ref = collection(db, "user", user.uid, "profile")
                    //     let userData = {
                    //         name: name,
                    //         email: user.email,
                    //     }
                    //     addDoc(ref, userData)
                    //     setShowModal(true);
                    //     setModalMessage("Sign up successful")
                    //     navigate("/dashboard")
                    // } catch (err) {
                    //     console.log(err)

                    // }
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorMessage);
                    // setShowModal(true);
                    // setModalMessage(errorMessage)

                    if (error.message == "Firebase: Password should be at least 6 characters (auth/weak-password).") {
                        setErrorConfirmPassword("Password should be at least 6 characters");
                    }

                    if (error.message == "Firebase: Error (auth/email-already-in-use).") {
                        setErrorConfirmPassword("Email Already registered");
                    }
                });
        }
    }

    return (
        <>
            <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />

            <div className='container signup-page'>
                <form className='sign-up'>
                    <div>
                        <TextField
                            formLabel={t('email')}
                            className='auth-input'
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder={t('enter-your-email')}
                            onChange={handleEmailChange} />
                    </div>

                    <div className='textfield-holder'>
                        <TextField
                            formLabel={t('name')}
                            className='auth-input'
                            id="email-address"
                            name="email"
                            required
                            placeholder={t('enter-your-name')}
                            onChange={handleNameChange} />
                    </div>

                    <div>
                        <PasswordTextField
                            formLabel={t('password')}
                            className='password-input'
                            id="password"
                            name="password"
                            type="password"
                            placeholder={t('enter-your-password')}
                            onChange={handlePasswordChange} />
                    </div>

                    <div>
                        <PasswordTextField
                            formLabel={t('verify-password')}
                            className='password-input'
                            type="password"
                            id="password"
                            name="password"
                            label={t('confirm-password')}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder={t('confirm-password')} />
                        {errorConfirmPassword && < p className='error-message'>{errorConfirmPassword}</p>}
                    </div>

                    <div className='auth-button-container'>
                        {isButtonActive ?
                            <ButtonColored
                                label={t('continue')}
                                onClick={onSubmit}
                                className="sign-in-btn-block"
                            />
                            :
                            <ButtonColored
                                className="sign-in-disabled"
                                label={t('continue')}
                                disabled
                            />}
                    </div>

                </form>
            </div >
        </>
    );

}







