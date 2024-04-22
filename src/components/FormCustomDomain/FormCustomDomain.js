import React, { useState, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../i18n';
import CustomDomainFunction from '../../components/CustomDomainInstruction/CustomDomainInstruction';
export default function FormCustomDomain() {
    const [domain, setDomain] = useState('');
    const handleDomain = (event) => {
        setDomain(event.target.value);
    };
    const currentLanguage = i18n.language;

 

    return (
        <>
            <h1 className='sub-title'>Custom Domain</h1>
            <p className='form-custom-domain-note'>Paste in the links of your desktop and mobile prototypes from Figma below to have them create your Figmafolio site. By adding separate desktop and mobile links, all viewers can easily preview your work on any device. We'll detect the device and show the appropriate prototype.</p>
            <h2 className='form-sub-header'>Enter your domain</h2>
            <div>
                <input
                    className='form-input'
                    type="text"
                    placeholder={t('enter-your-domain')}
                    value={domain}
                    onChange={handleDomain}
                />

                <CustomDomainFunction />
            </div>


        </>
    );
}