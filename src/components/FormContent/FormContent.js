import React, { useState, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../i18n';
import ButtonColored from '../ButtonColored/ButtonColored';
import ButtonClear from '../ButtonClear/ButtonClear';
export default function FormContent(props) {
    const [figmaDesktopUrl, setDesktopUrl] = useState(props.setFigmaDesktopUrl || "");
    const [figmaMobileUrl, setFigmaMobileUrl] = useState(props.setFigmaMobileUrl || "");
    const currentLanguage = i18n.language;

    const handlefigmaDesktopUrl = (event) => {
        const stringFigmaDesktopUrl = event.target.value
        setDesktopUrl(stringFigmaDesktopUrl);
        props.onChildDesktopUrl(stringFigmaDesktopUrl);
    };

    const handlefigmaMobileUrl = (event) => {
        const stringFigmaMobileUrl = event.target.value
        setFigmaMobileUrl(stringFigmaMobileUrl);
        props.onChildFigmaMobileUrl(stringFigmaMobileUrl);
    };

    return (
        <>
            <h1 className='sub-title'>Figma Links</h1>
            <p className='.form-content-upper-notes'>Paste in the links of your desktop and mobile prototypes from Figma below to have them create your Figmafolio site. By adding separate desktop and mobile links, all viewers can easily preview your work on any device. We'll detect the device and show the appropriate prototype.</p>
            <h2 className='form-sub-header'>
                {t('desktop-prototype-link')}
            </h2>
            <div>
                <input
                    className='form-input'
                    type="text"
                    placeholder={t('custom-desktop-url')}
                    value={figmaDesktopUrl}
                    onChange={handlefigmaDesktopUrl}

                />
            </div>
            <h2 className='form-sub-header'>
                {t('mobile-prototype-link')}
            </h2>
            <div>
                <input
                    className='form-input'
                    type="text"
                    placeholder={t('custom-mobile-url')}
                    value={figmaMobileUrl}
                    onChange={handlefigmaMobileUrl}
                />
            </div>

            <p className='form-content-note'>Note:</p>
            <ul className='form-content-note-list'>
                <li>Paste in the link to a prototype or specific prototype flow, not the Figma file.</li>
                <li>If you only provide one prototype link, we will show that on both desktop and mobile.</li>
                <li>For best results, match prototype’s background colour to your sites background colour in Figma in prototype settings.</li>
            </ul>
            <ButtonClear className='go-to-preview' onClick={props.goToPreview} label="Preview" />
            <ButtonColored className="folio-form-save-btn" label={"Save"} onClick={props.saveFigmaUrl} />
        </>
    );
}