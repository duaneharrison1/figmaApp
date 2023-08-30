import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './Auth.css';

const Signup = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            alert("retry password")
        } else {
            await createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log(user);
                    navigate("/login")
                    // ...
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage);
                    // ..
                });
        }
    }

    return (

        <>
            <div className='container'>
                <h1 className='header-text'> Sign up to Figmafolio </h1>
                <form className='form'>
                    <div>
                        <input
                            className='input'
                            type="email"
                            label="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Email"
                        />
                    </div>

                    <div>
                        <input
                            className='input'
                            type="password"
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Password"
                        />
                    </div>

                    <div>
                        <input
                            className='input'
                            type="password"
                            label="Confirm password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm password"
                        />
                    </div>

                    <button
                        className='btn-sign-in'
                        type="submit"
                        onClick={onSubmit}>
                        Sign up
                    </button>
                    <p className="no-account-yet">
                        Already have an account?{' '}
                        <NavLink to="/login" >
                            Sign in
                        </NavLink>
                    </p>
                </form>
            </div>
        </>
    );

}

export default Signup;




