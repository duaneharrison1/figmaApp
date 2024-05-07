import React, { useState } from 'react';
import { t } from 'i18next';
import i18n from '../../i18n';
import ButtonColored from '../ButtonColored/ButtonColored';
export default function FormTitle(props) {
    const currentLanguage = i18n.language;
    const [title, setTitle] = useState(props.setTitle || "");

    const handleTitle = (event) => {
        const stringTitle = event.target.value
        setTitle(stringTitle);
        props.onChildDataSubmit(stringTitle);
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

                <ButtonColored className="folio-form-save-btn" label={"Save"} onClick={props.saveTitle} />

            </div>
        </>
    );
}