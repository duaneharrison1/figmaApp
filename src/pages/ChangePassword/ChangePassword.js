import React, { useState, useEffect } from 'react';

import { NavLink, useNavigate } from 'react-router-dom'
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import TextField from '../../components/TextField/TextField.js';
import ButtonColored from '../../components/ButtonColored/ButtonColored.js';
import { auth as FirebaseAuth } from '../../firebase';
export default function ChangePassword() {
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState(null);

    const handleNewPassword = (newPassword) => {
        setNewPassword(newPassword);
    };


    const handleChangePassword = (event) => {
        event.preventDefault();
        const auth = getAuth();
        const user = auth.currentUser;

        try {
            const credential = EmailAuthProvider.credential(
                user.email,
                "qwer123"
            );
            reauthenticateWithCredential(user, credential).then(() => {
                updatePassword(user, "qwer1234").then(() => {
                    console.log("successful")
                }).catch((error) => {
                    console.log(error)
                });
            });
        } catch (error) {
            console.log(error.message);
        }

        // var cred = EmailAuthProvider.credential(
        //     user.email, "qwer123")

        // reauthenticateWithCredential(cred).then(() => {

        //     updatePassword(user, "qwer1234").then(() => {
        //         console.log("successful")
        //     }).catch((error) => {
        //         console.log(error)
        //     });
        // }).catch((error) => {
        //     console.log(error)
        // });

    };

    return (
        <div>
            <h2>Change Password</h2>
            {error && <p>{error}</p>}
            <input
                type="password"
                placeholder="New Password"
                onChange={handleNewPassword}
            />
            <button onClick={handleChangePassword}>Change Password</button>
        </div>
    );
}