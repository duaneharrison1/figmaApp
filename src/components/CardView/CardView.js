import React from 'react';
import './CardView.css';
import cardView from '../../assets/images/cardView.png'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
const CardView = (props) => {
    const currentLanguage = i18n.language;
    const { t } = useTranslation();
    const index = props.index
    const subscriptionType = props.subscriptionType
    const figmaMobileUrl = props.figmaMobileUrl
    const figmaDesktopUrl = props.figmaDesktopUrl
    const isDraft = props.isDraft
    const siteTitle = props.siteTitle
    const createdAt = props.createdAt
    const updatedAt = props.updatedAt
    const url = props.url
    const onClickDelete = props.onClickDelete
    const onClickUpdate = props.onClickUpdate
    const [isLinkEnabled, setIsLinkEnabled] = useState(false);

    const inactiveApp = {
        border: 'none',
        backgroundColor: 'gray',
    };



        const formatDate = (date) => {
          const options = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            month: '2-digit',
            day: '2-digit',
            year: '2-digit'
          };
          return new Date(date.seconds * 1000).toLocaleTimeString("en-US") + ' on ' + new Date(date.seconds * 1000).toLocaleDateString("en-US");
        };


    return (
        <>
            <div className="card preview-card" >
                <a href={`https://www.figmafolio.com/${url}`} target="_blank">
                    <div className='figmaThumbnail' style={subscriptionType == "regular" && index != 0 ? inactiveApp :
                        subscriptionType == "monthlyPlan" && index > 4 ? inactiveApp :
                            {}}>
                        <iframe
                            src={figmaDesktopUrl}
                            allowFullScreen

                            className='dashboard-figma-view'></iframe>
                    </div>
                </a >

                <div className="holder d-flex justify-content-between">
                    <div className='container'>
                        <h1 className='site-title'> {siteTitle}</h1>
                        {/* {isDraft == "false" ? <h1 className='published'> {t('published')}</h1> : <h1 className='draft'> {t('draft')}</h1>} */}
                        <h1 className='last-updated-on'> Last updated on {formatDate((updatedAt) ? updatedAt : createdAt)}</h1>
                        
                    </div>
                    <div>
                        <div className="dropdown" >
                            <button className="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="black" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" />
                                    <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="black" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" />
                                    <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="black" stroke-width="2" stroke-linecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-dark bg-light">
                                <li><a className="dropdown-item" onClick={onClickUpdate}>{t('update')}</a></li>
                                <li><a className="dropdown-item text-danger" onClick={onClickDelete}>{t('delete')}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div >


        </>

    );
};
export default CardView;