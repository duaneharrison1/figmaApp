import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import './Auth.css';
import TextField from '../../components/TextField/TextField.js';
import Button from '../../components/Button/Button.js';

export default function LoginPage() {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                console.log(errorCode, errorMessage)
            });
    }

    return (
        <>
            <div className='container'>
                <form className='form'>
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
                    </div>
                    <NavLink className='forgot-password' to="/forgotpassword" >
                        Forgot password
                    </NavLink>
                    <div>
                        <Button
                            label='Sign in'
                            onClick={onLogin}
                            className="btn-block"
                        />
                    </div>
                </form>



            </div>


        </>
    )
}

