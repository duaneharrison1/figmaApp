import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase';
import './Auths.css';
import TextField from '../../components/TextField/TextField.js';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import AlertModal from '../../components/AlertModal/AlertModal';

export default function SignupPage() {
    const navigate = useNavigate();
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
                    // Signed in
                    try {
                        const user = userCredential.user;
                        const ref = collection(db, "user", user.uid, "profile")
                        let userData = {
                            name: name,
                            email: user.email,
                        }
                        addDoc(ref, userData)
                        setShowModal(true);
                        setModalMessage("Sign up successful")
                        navigate("/dashboard")
                    } catch (err) {
                        console.log(err)

                    }
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

            <div className='container m-0 p-0'>
                <form className='sign-up'>
                    <div>
                        <TextField
                            formLabel='Email'
                            className='input'
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder="Email address"
                            onChange={handleEmailChange} />

                        <TextField
                            formLabel='Name'
                            className='input'
                            id="email-address"
                            name="email"
                            required
                            placeholder="Name"
                            onChange={handleNameChange} />
                    </div>

                    <div>
                        <TextField
                            formLabel='Password'
                            className='input'
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            onChange={handlePasswordChange} />
                    </div>

                    <div>
                        <TextField
                            formLabel='Verify password'
                            className='input'
                            type="password"
                            label="Confirm password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Confirm password" />
                        {errorConfirmPassword && < p className='error-message'>{errorConfirmPassword}</p>}
                    </div>

                    {isButtonActive ?
                        <ButtonColored
                            label='Continue'
                            onClick={onSubmit}
                            className="btn-block"
                        />
                        :
                        <ButtonColored
                            className="disabled"
                            label='Continue'
                            disabled
                        />}
                </form>
            </div >
        </>
    );

}







