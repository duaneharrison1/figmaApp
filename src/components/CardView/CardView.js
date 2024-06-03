import React, { useState } from 'react';
import './CardView.css';
import moreVertical from '../../assets/images/more-vertical.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

const CardView = (props) => {
    const { t } = useTranslation();
    const {
        index,
        subscriptionType,
        figmaDesktopUrl,
        siteTitle,
        createdAt,
        updatedAt,
        url,
        onClickDelete,
        onClickUpdate
    } = props;

    const inactiveApp = {
        border: 'none',
        backgroundColor: 'gray',
    };

    const formatDate = (date) => {
        return new Date(date.seconds * 1000).toLocaleTimeString("en-US") + ' on ' + new Date(date.seconds * 1000).toLocaleDateString("en-US");
    };

    const figmaThumbnailStyle = (subscriptionType === "regular" && index !== 0) || (subscriptionType === "monthlyPlan" && index > 4) ? inactiveApp : {};

    return (
        <div className="card preview-card">
            <a href={`https://www.figmafolio.com/${url}`} target="_blank" rel="noopener noreferrer">
                <div className='figmaThumbnail' style={figmaThumbnailStyle}>
                    <iframe
                        title='Card Preview'
                        src={figmaDesktopUrl}
                        allowFullScreen
                        className='dashboard-figma-view'
                    ></iframe>
                </div>
            </a>

            <div className="holder d-flex justify-content-between">
                <div className='dashboard-card-title'>
                    <h1 className='site-title'>{siteTitle}</h1>
                    <h1 className='last-updated-on'>Last updated on {formatDate(updatedAt || createdAt)}</h1>
                </div>
                <div>
                    <div className="dropdown">
                        <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src={moreVertical} alt="More options" />
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" onClick={onClickUpdate}>{t('update')}</a></li>
                            <li><a className="dropdown-item text-danger" onClick={onClickDelete}>{t('delete')}</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardView;
