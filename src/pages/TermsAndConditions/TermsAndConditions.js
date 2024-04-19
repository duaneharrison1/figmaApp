import "./TermsAndConditions.css";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
export default function PrivacyPolicy() {
    const currentLanguage = i18n.language;
    const { t } = useTranslation();
    return (
        <>

            <div className='terms-and-privacy-container'>
                <div className='terms-and-privacy-body'>
                    <h1 className='terms-and-privacy-header'>{t('terms-and-conditions')}</h1>
                    <h1 className='terms-and-privacy-subheader'>{t('using-the-site')}</h1>
                    <p>{t('the-site-allows')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('changes-to-terms')}</h1>
                    <p>{t('we-may-modify')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('subscriptions')}</h1>
                    <p>{t('parts-of-the-site')}</p>
                    <h3 className="terms-and-privacy-title">{t('sub-cancellation')}</h3>
                    <p>{t('you-may-cancel')}</p>
                    <h3 className="terms-and-privacy-title">{t('refunds')}</h3>
                    <p>{t('execpt-when-required')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('access-and-use')}</h1>
                    <p>{t('we-grant-you')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('content')}</h1>
                    <p>{t('you-are-solely')}</p>
                    <h3 className="terms-and-privacy-title">{t('content-backups')}</h3>
                    <p>{t('we-make-reasonable')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('limitation-of-liability')}</h1>
                    <p>{t('the-site-and-all')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('indemnification')}</h1>
                    <p>{t('you-agree-to-defend')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('intellectual-property')}</h1>
                    <p>{t('the-site-may-contain')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('privacy')}</h1>
                    <p>{t('please-review')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('termination')}</h1>
                    <p>{t('we-reserve-the-right')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('governing-law-and')}</h1>
                    <p>{t('this-agreement-is')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('severability')}</h1>
                    <p>{t('if-any-part')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('complete-agreement')}</h1>
                    <p>{t('this-agreement')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('acceptable-use-policy')}</h1>
                    <p>{t('you-agree-not-to')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('service-availability')}</h1>
                    <p>{t('service-availability-content')}</p>
                </div>
            </div>
        </>)
}