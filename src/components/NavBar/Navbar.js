
import React, { useState, useEffect } from 'react';
import { useAuth } from "../../firebase";
import './Navbar.css';
import ProfileIcon from '../../assets/images/profileicon.png';
import { Link } from 'react-router-dom';

export default function Navbar(props) {
    const currentUser = useAuth();
    const handleSwitchChange = props.handleSwitchChange
    const onClickLogout = props.onClickLogout
    const email = props.email
    const isFromForm = props.isFromForm
    const [photoURL, setPhotoURL] = useState();


    useEffect(() => {
        if (currentUser?.photoURL) {
            setPhotoURL(currentUser.photoURL);
        }
    }, [currentUser])

    return (

        <nav className="custom-navbar">
            <div className="row">
                <div className="col d-flex  align-items-center">
                    {!isFromForm ? (
                        <a className="nav-title" href="/"> Figmafolio</a>
                    )
                        : (
                            <a className="back-to-library" href="/dashboard"> &lt; Back to your library </a>)}
                </div>

                <div className="col d-flex align-items-center justify-content-center">
                    <a className="nav-title">Your Library</a>
                </div>


                <div className="col d-flex justify-content-end align-items-center">

                    <a className="username">{email}</a>
                    <Link to="/profile" >

                        <img src={!photoURL ? ProfileIcon : photoURL} alt="Avatar" className="nav-avatar-icon" />

                    </Link>

                    <div className="dropdown">
                        <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <svg width="12" height="14" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                            </svg>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark bg-light">
                            <li><a className="dropdown-item" onClick={onClickLogout}>Logout</a></li>
                        </ul>
                    </div>

                </div>
            </div>
        </nav >
    );
}
