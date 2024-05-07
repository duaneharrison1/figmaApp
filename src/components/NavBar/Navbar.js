
import React, { useState, useEffect } from 'react';
import { useAuth } from "../../firebase";
import './Navbar.css';
import ProfileIcon from '../../assets/images/profileicon.png';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { signOut } from "firebase/auth";
import { db, auth } from '../../firebase';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import ButtonClear from '../ButtonClear/ButtonClear';
export default function Navbar(props) {
    const { t } = useTranslation();
    const currentUser = useAuth();
    const handleSwitchChange = props.handleSwitchChange
    const onClickLogout = props.onClickLogout
    const generatedUrl = props.generatedUrl
    const email = props.email
    const className = props.className
    const isFromForm = props.isFromForm
    const title = props.title
    const [photoURL, setPhotoURL] = useState();
    const navigate = useNavigate();
    const currentLanguage = i18n.language;



    useEffect(() => {
        if (currentUser?.photoURL) {
            setPhotoURL(currentUser.photoURL);
        }
    }, [])

    const handleGoToProfile = () => {
        navigate('/' + currentLanguage + '/profile');
    }

    const handleGoToBilling = () => {
        navigate('/' + currentLanguage + '/billing');
    }

    const viewSite = () => {
        window.open(`https://figmafolio.com/${props.generatedUrl}`, "_blank");
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
                    {isFromForm === "newForm" ?
                        (<a className="back-to-library" href={"/" + currentLanguage + "/dashboard"}> {t('back-to-your-library')} </a>)
                        : (<a className="nav-title" href={"/" + currentLanguage + "/dashboard"}> Figmafolio</a>)}
                </div>

                <div className="col d-flex align-items-center justify-content-center">
                    {isFromForm === "newForm" ?
                        <>
                            {
                                generatedUrl.trim() === "" ?
                                    (
                                        <h1 className="nav-title">{t('new-project')}</h1>
                                    ) :
                                    (
                                        <h1 className="nav-title">{props.title}</h1>
                                    )
                            }
                        </>
                        : (
                            <h1 className="nav-title">Your Library</h1>
                        )
                    }
                </div>

                <div className="col d-flex justify-content-end align-items-center">

                    {isFromForm === "newForm" ?
                        <>
                            {
                                generatedUrl.trim() !== "" ? (
                                    <ButtonClear className='view-site' onClick={viewSite} label="View Site" />
                                ) : (
                                    null
                                )
                            }
                        </>
                        : (
                            <>
                                <div className="dropdown">
                                    <button className='btn-dropdown' type="button" data-bs-toggle="dropdown" >
                                        {email}
                                    </button>
                                    <ul className="dropdown-menu  bg-light">
                                        <li><a href className="dropdown-item" onClick={handleGoToProfile}>{t('profile')}</a></li>
                                        <li><a href className="dropdown-item" onClick={handleGoToBilling}>{t('billing')}</a></li>
                                        <li><a href className="dropdown-item" onClick={handleLogout}>{t('logout')}</a></li>
                                    </ul>
                                </div>
                                <Link to={'/' + currentLanguage + "/profile"} >
                                    <img src={!photoURL ? ProfileIcon : photoURL} alt="Avatar" className="nav-avatar-icon" />
                                </Link>

                                <div className="dropdown">
                                    <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <svg width="12" height="14" fill="currentColor" className="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                            <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                        </svg>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-dark bg-light">
                                        <li><a href className="dropdown-item" onClick={handleGoToProfile}>{t('profile')}</a></li>
                                        <li><a href className="dropdown-item" onClick={handleGoToBilling}>{t('billing')}</a></li>
                                        <li><a href className="dropdown-item" onClick={handleLogout}>{t('logout')}</a></li>
                                    </ul>
                                </div>
                            </>
                        )}
                </div>
            </div>
        </nav >
    );
}
