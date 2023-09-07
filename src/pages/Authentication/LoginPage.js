import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import './Auths.css';
import TextField from '../../components/TextField/TextField.js';
import Button from '../../components/Button/Button.js';

export default function LoginPage() {
    const [errorEmail, setErrorEmail] = useState(null);
    const [errorPassword, setErrorPassword] = useState(null);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const isButtonActive = email && password;

    const handleEmailChange = (email) => {
        setEmail(email);
    };

    const handlePasswordChange = (password) => {
        setPassword(password);
    };

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigate("/dashboard")
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
                if (error.message == "Firebase: Error (auth/user-not-found).") {
                    setErrorEmail("Email address not found");
                }

                if (error.message == "Firebase: Error (auth/wrong-password).") {
                    setErrorPassword("Wrong password");
                }

                if (error.message == "Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).") {
                } setErrorPassword("Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.");


            });
    }


    // try {
    //     await sendPasswordResetEmail(auth, email);
    //     setResetEmailSent(true);
    //     setError(null);
    // } catch (error) {
    //     if (error.message == "Firebase: Error (auth/user-not-found).") {
    //         setError("Email address not found");
    //     }
    return (
        <>
            <div className='container'>
                <form className='login'>
                    <div>
                        <TextField
                            formLabel="Email"
                            errorMsg="Invalid email"
                            className='input'
                            id="email-address"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            onChange={handleEmailChange} />
                        {errorEmail && < p className='error-message'>{errorEmail}</p>}
                    </div>
                    <div>
                        <TextField
                            formLabel="Password"
                            errorMsg="Wrong password"
                            className='input'
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            onChange={handlePasswordChange} />
                        {errorPassword && < p className='error-message'>{errorPassword}</p>}
                    </div>
                    <NavLink className='forgot-password' to="/forgotpassword" >
                        Forgot password
                    </NavLink>
                    <div>
                        {isButtonActive ?
                            <Button
                                label='Sign in'
                                onClick={onLogin}
                                className="btn-block"
                            />
                            :
                            <Button
                                className="disabled"
                                label='Sign in'
                                disabled
                            />}
                    </div>
                </form>



            </div>


        </>
    )
}
