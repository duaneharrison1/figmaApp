import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { sendPasswordResetEmail } from "firebase/auth"
import ButtonColored from '../../../components/ButtonColored/ButtonColored';
import './ForgotpasswordPage.css';
import '../Auths.css';
import auth_side_frame from '../../../assets/images/sideframe.png'
import TextField from '../../../components/TextField/TextField';

export default function ForgotpasswordPage() {
    const [userIsDesktop, setUserIsDesktop] = useState(true);
    useEffect(() => {
        window.innerWidth > 1280 ? setUserIsDesktop(true) : setUserIsDesktop(false);
    }, [userIsDesktop]);

    const [email, setEmail] = useState("");
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [error, setError] = useState(null);

    const handleEmailChange = (email) => {
        setEmail(email);
    };

    const handleResetPassword = async (e) => {
        console.log("fgff" + email)
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setResetEmailSent(true);
            setError(null);
            console.log("xxx" + email)
        } catch (error) {
            if (error.message == "Firebase: Error (auth/user-not-found).") {
                setError("Email address not found");
            }
            console.log("yyy" + email)
            setResetEmailSent(false);
        }
    };

    return (
        <div className='forgotpassword-container m-0 p-0'>
            <div>
                <div className='container-fluid desktop-main-auth-container'>
                    <div className='row'>
                        <div className='col-md-7  forgotpassword-tab-view'>
                            <div className='card'>
                                <h1 className='main-title'>Figmafolio</h1>
                                <h1 className='header-text'>Forgot password</h1>
                                <p className='forgot-password-subheader'>Enter your email and we’ll send you a link to reset your password</p>
                                {resetEmailSent ?
                                    (
                                        <p>An email with a password reset link has been sent to your email address.</p>
                                    )
                                    :
                                    (
                                        <div className='container reset-password-form'>
                                            <TextField
                                                errorMsg="Invalid email"
                                                className='auth-input'
                                                id="email-address"
                                                name="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                onChange={handleEmailChange} />

                                            {error && < p className='error-message'>{error}</p>}

                                            <ButtonColored
                                                label='Reset Password'
                                                onClick={handleResetPassword}
                                                className="sign-in-btn-block"
                                            />
                                        </div>
                                    )}
                            </div>
                        </div>

                        <div className='col-md-5 sideframe-view' >
                            <div className='side-frame'>
                                <div className='side-frame-content'>
                                    <h2 className='auth-sub-header'>
                                        Seamless Showcase: Unify Your Prototypes with a Custom URL
                                    </h2>
                                    <img src={auth_side_frame} className='sideframe_img' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}



