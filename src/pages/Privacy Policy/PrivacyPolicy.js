import "./../TermsAndConditions/TermsAndConditions.css"
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
export default function PrivacyPolicy() {
    const currentLanguage = i18n.language;
    const { t } = useTranslation();
    return (
        <>

            <div className='terms-and-privacy-container'>
                <div className='terms-and-privacy-body'>
                    <h1 className='terms-and-privacy-header'>{t('privacy-policy')}</h1>
                    <p>{t('figmafolio.com-or-we')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('collection-of-personal')}</h1>
                    <p>{t('we-collect-info')}</p>
                    <ul>
                        <li>{t('contact-details')}</li>
                        <li>{t('account-login')}</li>
                        <li>{t('user-profile-info')}</li>
                        <li>{t('content-you-upload')}</li>
                    </ul>
                    <p>{t('we-also-automatically')}</p>
                    <ul>
                        <li>{t('browser-and-device')}</li>
                        <li>{t('server-log-info')}</li>
                        <li>{t('info-collected-by')}</li>
                    </ul>
                    <h1 className='terms-and-privacy-subheader'>{t('use-of-personal')}</h1>
                    <p>{t('we-use-personal')}</p>
                    <ul>
                        <li>{t('provide-our-services')}</li>
                        <li>{t('comm-with-you')}</li>
                        <li>{t('customize-content')}</li>
                        <li>{t('detect-and-prevent')}</li>
                        <li>{t('comply-with-legal')}</li>
                    </ul>
                    <p>{t('we-only-share')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('data-retention')}</h1>
                    <p>{t('we-retain-personal')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('data-protection')}</h1>
                    <p>{t('we-take-reasonable')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('privacy-rights')}</h1>
                    <p>{t('you-may-access')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('changes-to-policy')}</h1>
                    <p>{t('we-may-change')}</p>
                    <h1 className='terms-and-privacy-subheader'>{t('contact-us')}</h1>
                    <p>{t('if-you-any')}</p>
                </div>
            </div>
        </>)
}