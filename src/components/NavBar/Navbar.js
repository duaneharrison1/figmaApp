
import React, { useState } from 'react';
import './Navbar.css';


export default function Navbar(props) {

    const onClickLogout = props.onClickLogout
    const email = props.email
    return (

        <nav class="navbar navbar-light custom-navbar">
            <div className='container'>
                <a class="navbar-brand" href="/">Figmafolio</a>
                <div class="navbar-center">
                    <a class="navbar-brand">Your Library</a>
                </div>
                <div class="nav-item ml-auto">
                    <div className='d-flex'>
                        <a class="nav-link">{email}</a>
                        <div className="dropdown">
                            <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
