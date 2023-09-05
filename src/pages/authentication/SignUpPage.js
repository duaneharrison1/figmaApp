import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './Auths.css';
import TextField from '../../components/TextField/TextField.js';
import Button from '../../components/Button/Button.js';
import AlertModal from '../../components/AlertModal/AlertModal';

export default function SignUpPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleEmailChange = (email) => {
        setEmail(email);
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
            console.log("confirm password not match");
        } else {
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    setShowModal(true);
                    setModalMessage("Sign up successful")
                    navigate("/auth")
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                    setShowModal(true);
                    setModalMessage(errorMessage)
                    // ..
                });
        }
    }

    return (
        <>
            <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />
            <div className='container'>
                <form className='form'>
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
                    </div>

                    <Button label='Continue'
                        onClick={onSubmit}
                        className="btn-block"
                    />
                </form>
            </div >
        </>
    );

}






