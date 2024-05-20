import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import insOne from './../../../assets/images/ins-1.png';
import insTwo from './../../../assets/images/ins-2.png';
import insThree from './../../../assets/images/ins-3.png';
import insFour from './../../../assets/images/ins-4.png';
import MobileNavBar from '../MobileNavBar/MobileNavbar';
import { useNavigate, useLocation } from 'react-router-dom';
import i18n from '../../../i18n';
import Footer from '../../../components/Footer/Footer';

const MobileFormInstruction = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const currentLanguage = i18n.language;

    const [docId, setDocId] = useState(
        location && location.state && location.state.object
          ? location.state.object.id
          : ""
      );
    
      const [title, setTitle] = useState(
        location && location.state && location.state.object && location.state.object.title
          ? location.state.object.title
          : ""
      );
      const [generatedUrl, setGeneratedUrl] = useState(
        location && location.state && location.state.object && location.state.object.generatedUrl
          ? location.state.object.generatedUrl
          : ""
      );
      const [faviconImage, setFaviconImage] = useState(
        location && location.state && location.state.object && location.state.object.faviconUrl
          ? location.state.object.faviconUrl
          : ""
      );
    
      const [figmaDesktopUrl, setFigmaDesktopUrl] = useState(
        location.state && location.state.object && location.state.object.urls && location.state.object.urls.figmaDesktopUrl
          ? location.state.object.urls.figmaDesktopUrl
          : ""
      );
      const [figmaMobileUrl, setFigmaMobileUrl] = useState(
        location.state && location.state.object && location.state.object.urls && location.state.object.urls.figmaMobileUrl
          ? location.state.object.urls.figmaMobileUrl
          : ""
      );
    
      const [domain, setDomain] = useState(
        location && location.state && location.state.object && location.state.object.customDomain
          ? location.state.object.customDomain
          : ""
      );

      const [subscriptionType, setSubscriptionType] = useState(location && location.state  && location.state.subscriptionType ? location.state.subscriptionType : "");

    const backToMobileFolioForm = () => {
  
        navigate("/" + currentLanguage + "/folio-form",
        {
            state: {
              object: {
                id: docId,
                title: title,
                generatedUrl: generatedUrl,
                faviconUrl: faviconImage,
                customDomain: domain,
                urls: {
                  figmaDesktopUrl: figmaDesktopUrl,
                  figmaMobileUrl: figmaMobileUrl
                }
              }, subscriptionType : subscriptionType
            }
          }
        );
      }

    return (
      <div className='app-wrapper-mobile'>
            <MobileNavBar title={title} backToMobileFolioForm={backToMobileFolioForm}/>
        <div className='div-form-instruction-mobile'>
          
            <h1 className='mobile-form-title'>{t('need-help-setting')}</h1>
            <div className='row mobile-instruction-div'>
                <div className="col-md-6">

                    <img src={insOne} className='instruction-img' />

                    <h1 className='instruction-title'>{t('instruct-one')}</h1>
                    <p className='instructions'> &#8226; {t('instruct-one-one')}</p>
                    <p className='instruction-note'> {t('instruct-one-note')}</p>
                </div>
                <div className="col-md-6">

                    <img src={insTwo} className='instruction-img' />

                    <h1 className='instruction-title'>{t('instruct-two')}</h1>
                    <p className='instructions'> &#8226; {t('instruct-two-one')}</p>
                    <p className='instructions'> &#8226; {t('instruct-two-two')}</p>
                    <p className='instructions'> &#8226; {t('instruct-two-three')}</p>
                    <p className='instruction-note'> {t('instruct-two-note')}</p>
                </div>
                <div className="col-md-6">

                    <img src={insThree} className='instruction-img' />

                    <h1 className='instruction-title'>{t('instruct-three')}</h1>
                    <p className='instructions'>&#8226; {t('instruct-three-one')}</p>
                    <p className='instructions'>&#8226;  {t('instruct-three-two')} </p>
                    <p className='instructions'> &#8226; {t('instruct-three-three')}</p>
                </div>
                <div className="col-md-6">

                    <img src={insFour} className='instruction-img' />

                    <h1 className='instruction-title'>{t('instruct-four')}</h1>
                    <p className='instructions'>&#8226; {t('instruct-four-one')}</p>
                    <p className='instructions'>&#8226; {t('instruct-four-two')} </p>
                    <p className='instructions'>&#8226; {t('instruct-four-three')}</p>
                    <p className='instructions'>&#8226; {t('instruct-four-four')}</p>
                    <p className='instruction-note'>{t('instruct-four-note')}</p>
                </div>
            </div>
        </div>
        <Footer/>
        </div>
    )
}

export default MobileFormInstruction