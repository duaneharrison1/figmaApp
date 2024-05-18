
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../../i18n';
import chevronLeft from '../../../assets/images/chevron-left.png';

export default function MobileNavBar(props) {
    const { t } = useTranslation();
    const isFromTab = props.isFromTab
    const title = props.title
    const navigate = useNavigate();
    const currentLanguage = i18n.language;

 

    const backToDashboard = () => {
        navigate("/" + currentLanguage + "/dashboard");
    }
    return (

        <nav className="dashboardNavBar container-fluid" >
            <div className="row navbar-row">
                <div className="col d-flex align-items-center p-0">
                    {isFromTab === "fromTab" ?
                        (<div className='d-flex align-items-center your-library-container' onClick={backToDashboard}>
                            <img src={chevronLeft} className='chevron-left' />
                            <p className='back-your-library'> Your Library</p>
                        </div>
                        )
                        : (
                            <div className='d-flex align-items-center your-library-container' onClick={props.backToMobileFolioForm}>
                            <img src={chevronLeft} className='chevron-left' />
                            <p className='back-your-library'> {title ? title : "Your Library"}</p>
                        </div>
                            )}
                </div>
            </div>
        </nav >
    );
}
