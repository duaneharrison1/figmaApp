
import React, { useState } from 'react';
import './Navbar.css';
import ProfileIcon from '../../assets/images/profileicon.png';
import { Link } from 'react-router-dom';

export default function Navbar(props) {
    const handleSwitchChange = props.handleSwitchChange
    const onClickLogout = props.onClickLogout
    const email = props.email
    const isFromForm = props.isFromForm
    const [weatherData, setWeatherData] = useState([]);
    return (

        <nav className="navbar navbar-light custom-navbar">
            <div className='container main-nav-container'>
                {!isFromForm ? (<a className="navbar-brand" href="/"> Figmafolio</a>)
                    : (<a className="back-to-library" href="/dashboard"> &lt; Back to your library </a>)}

                <div className="navbar-center">

                    <a class="navbar-brand">Your Library</a>
                </div>
                <div className="nav-item ml-auto">
                    <div className='d-flex justify-content-center align-items-center'>
                        <a className="nav-link">{email}</a>

                        <Link to="/profile" >
                            <img src={ProfileIcon} alt="test" className='nav-avatar-icon' />
                        </Link>

                        <div className="dropdown">
                            <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg width="12" height="14" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                </svg>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-dark bg-light">
                                <li><a className="dropdown-item" onClick={onClickLogout}>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </nav >
    );
}
