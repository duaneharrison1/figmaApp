import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { sendPasswordResetEmail } from "firebase/auth"
import Button from '../../../components/Button/Button.js';
import './ForgotPasswordPage.css';
import '../Auth.css';
import SideFrame from '../../../components/SideFrame/SideFrame';



export default function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [error, setError] = useState(null);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setResetEmailSent(true);
            setError(null);
        } catch (error) {
            if (error.message == "Firebase: Error (auth/user-not-found).") {
                setError("Email address not found");
            }

            setResetEmailSent(false);
        }
    };

    return (<>
        <div className='container'>

            <div className='row'>
                <div className='col-6 tab-view'>
                    <h1 className='header-text'>Welcome to Figmafolio</h1>
                    {resetEmailSent ? (
                        <p>An email with a password reset link has been sent to your email address.</p>
                    ) : (<div className='container forgot-password-form'>
                        <form onSubmit={handleResetPassword}>
                            <input
                                className='input'
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {error && < p className='error-message'>{error}</p>}
                            <Button label='Reset Password' type="submit" />
                        </form>
                    </div>
                    )}
                </div>

                <div className='col-6'>
                    <SideFrame />
                </div>
            </div>
        </div>


    </>
    )
}