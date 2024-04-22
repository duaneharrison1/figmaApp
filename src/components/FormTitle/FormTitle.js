import React, { useState, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../i18n';
export default function FormTitle() {
    const currentLanguage = i18n.language;
    const [title, setTitle] = useState('');
    const handleTitle = (event) => {
        setTitle(event.target.value);
    };
    return (
        <>
            <div className=''>
                <h1 className='form-title'>{t('general')}</h1>

                <h2 className='form-sub-header'>{t('title')}</h2>
                <input
                    className='form-input'
                    type="text"
                    placeholder={t('enter-your-site-name')}
                    value={title}
                    onChange={handleTitle}
                />
                <p className='form-title-notes'> This will set the title of your whole website as it appears at the top of the browser window and in search engines.</p>

            </div>
        </>
    );
}