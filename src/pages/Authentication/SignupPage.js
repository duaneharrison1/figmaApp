import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './Auths.css';
import TextField from '../../components/TextField/TextField.js';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import AlertModal from '../../components/AlertModal/AlertModal';
import PasswordTextField from '../../components/PasswordTextfield/PasswordTextfield.js';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import firebase from '../../firebase';

export default function SignupPage(props) {
    const figmaDesktopUrl = props.figmaDesktopUrl;
    const figmaMobileUrl = props.figmaMobileUrl
    const generatedUrl = props.generatedUrl
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState(null);
    const isButtonActive = email && password && confirmPassword;
    const { t } = useTranslation();
    const currentLanguage = i18n.language;
    const dbFirestore = firebase.firestore();
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
        console.log("ffff" + figmaMobileUrl);
        console.log("kkkk" + figmaDesktopUrl);
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorConfirmPassword("Password does not match");
        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                try {
                    await dbFirestore.collection('user').doc(user.uid).set({
                        name: name,
                        email: user.email,
                    });
                    console.log('Document successfully writtenxxxxx!');
                } catch (error) {
                    const errorMessage = error.message;
                    console.log(errorMessage);
                }

                if (figmaDesktopUrl !== "" || figmaMobileUrl !== "") {
                    try {
                        await dbFirestore.collection('user').doc(user.uid).collection("url").doc(generatedUrl).set({
                            userId: user.uid,
                            generatedUrl: generatedUrl,
                            isDraft: "fromPlugin",
                            urls: {
                                figmaDesktopUrl: figmaDesktopUrl,
                                figmaMobileUrl: figmaMobileUrl
                            },
                            createdAt: new Date(),
                        })

                        console.log('Document successfully writtenxxxxx!');
                        navigate(`/${currentLanguage}/dashboard`);
                    } catch (error) {
                        const errorMessage = error.message;
                        console.log(errorMessage);
                    }
                }
            } catch (error) {
                const errorMessage = error.message;
                console.log(errorMessage);
                if (error.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
                    setErrorConfirmPassword("Password should be at least 6 characters");
                }

                if (error.message === "Firebase: Error (auth/email-already-in-use).") {
                    setErrorConfirmPassword("Email already registered");
                }
            }
        }
    };

    return (
        <>
            <AlertModal show={showModal} handleClose={handleCloseModal} alertMessage={modalMessage} />

            <div className='container signup-page'>
                <form className='sign-up' onSubmit={onSubmit}>
                    <div>
                        <TextField
                            formLabel={t('email')}
                            className='auth-input'
                            id="email-address"
                            name="email"
                            type="email"
                            required
                            placeholder={t('enter-your-email')}
                            onChange={handleEmailChange}
                        />
                    </div>

                    <div className='textfield-holder'>
                        <TextField
                            formLabel={t('name')}
                            className='auth-input'
                            id="name"
                            name="name"
                            required
                            placeholder={t('enter-your-name')}
                            onChange={handleNameChange}
                        />
                    </div>

                    <div>
                        <PasswordTextField
                            formLabel={t('password')}
                            className='password-input'
                            id="password"
                            name="password"
                            type="password"
                            placeholder={t('enter-your-password')}
                            onChange={handlePasswordChange}
                        />
                    </div>

                    <div>
                        <PasswordTextField
                            formLabel={t('verify-password')}
                            className='password-input'
                            type="password"
                            id="confirm-password"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder={t('confirm-password')}
                        />
                        {errorConfirmPassword && <p className='error-message'>{errorConfirmPassword}</p>}
                    </div>

                    <div className='auth-button-container'>
                        {isButtonActive ?
                            <ButtonColored
                                label={t('continue')}
                                type="submit"
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
            </div>
        </>
    );
}
