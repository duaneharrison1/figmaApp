
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
import SuccessModal from '../SuccessModal/SuccessModal';
const ChangePasswordModal = (props) => {
    const { show, handleClose } = props;
    const [userId] = useAuthState(auth);
    const [user, setUser] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    const [errorFirebase, setErrorFirebase] = useState(null);
    const id = props.id;
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const isButtonActive = password && newPassword && confirmNewPassword;
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const handleShowModal = () => {
        setShowChangePasswordModal(true);
    };

    const handleCloseModal = () => {
        setShowChangePasswordModal(false);
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
                        console.log("Signed out successfully")
                    }).catch((error) => {
                        // An error happened.
                    });
                    console.log("successfull change")
                    handleClose();
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
        <Modal className='changepassword-modal' show={show} onHide={handleClose}>
            <Modal.Body className='modal-body'>
                <h1 className='delete-header'>Change password</h1>
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
                {isButtonActive ?
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
                    />}

            </Modal.Body>
        </Modal >
    );
};

export default ChangePasswordModal;
