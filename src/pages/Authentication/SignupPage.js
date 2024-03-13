import React, { useState } from 'react';
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



                    // Password should be at least 6 characters (auth/weak-password).
                    // ..
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
                            formLabel='Email'
                            className='auth-input'
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder="Email address"
                            onChange={handleEmailChange} />
                    </div>

                    <div className='textfield-holder'>
                        <TextField
                            formLabel='Name'
                            className='auth-input'
                            id="email-address"
                            name="email"
                            required
                            placeholder="Name"
                            onChange={handleNameChange} />
                    </div>

                    <div>
                        <PasswordTextField
                            formLabel='Password'
                            className='password-input'
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handlePasswordChange} />
                    </div>

                    <div>
                        <PasswordTextField
                            formLabel='Verify password'
                            className='password-input'
                            type="password"
                            id="password"
                            name="password"
                            label="Confirm password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Confirm password" />
                        {errorConfirmPassword && < p className='error-message'>{errorConfirmPassword}</p>}
                    </div>


                    <div className='auth-button-container'>
                        {isButtonActive ?
                            <ButtonColored
                                label='Continue'
                                onClick={onSubmit}
                                className="sign-in-btn-block"
                            />
                            :
                            <ButtonColored
                                className="sign-in-disabled"
                                label='Continue'
                                disabled
                            />}
                    </div>

                </form>
            </div >
        </>
    );

}







