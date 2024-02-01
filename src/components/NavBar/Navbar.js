
import React, { useState, useEffect } from 'react';
import { useAuth } from "../../firebase";
import './Navbar.css';
import ProfileIcon from '../../assets/images/profileicon.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { db, auth } from '../../firebase';
export default function Navbar(props) {
    const currentUser = useAuth();
    const handleSwitchChange = props.handleSwitchChange
    const onClickLogout = props.onClickLogout
    const email = props.email
    const className = props.className
    const isFromForm = props.isFromForm
    const title = props.title
    const [photoURL, setPhotoURL] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser?.photoURL) {
            setPhotoURL(currentUser.photoURL);
        }
    }, [])

    const handleGoToProfile = () => {
        navigate('/profile');
    }

    const handleGoToBilling = () => {
        navigate('/billing');
    }

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    return (

        <nav className={className}>
            <div className="row">
                <div className="col d-flex  align-items-center">
                    {isFromForm == "newForm" || isFromForm == "editForm" ?
                        (<a className="back-to-library" href="/dashboard"> &lt; Back to your library </a>)
                        : (<a className="nav-title" href="/"> Figmafolio</a>)}
                </div>

                <div className="col d-flex align-items-center justify-content-center">
                    {isFromForm == "newForm" ? (<a className="nav-title">New project</a>) :
                        isFromForm == "editForm" ? (<a className="nav-title">{title}</a>) :
                            (<a className="nav-title">Your Library</a>)}
                </div>
                <div className="col d-flex justify-content-end align-items-center">
                    <div className="dropdown">

                        <button className='btn-dropdown' type="button" data-bs-toggle="dropdown" >
                            {email}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark bg-light">
                            <li><a className="dropdown-item" onClick={handleGoToProfile}>Profile</a></li>
                            <li><a className="dropdown-item" onClick={handleGoToBilling}>Billing</a></li>
                            <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>
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
                            <li><a className="dropdown-item" onClick={handleGoToProfile}>Profile</a></li>
                            <li><a className="dropdown-item" onClick={handleGoToBilling}>Billing</a></li>
                            <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </div>

                </div>
            </div>
        </nav >
    );
}
