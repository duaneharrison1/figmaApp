import React from 'react';
import { useTranslation } from 'react-i18next';
import insOne from './../../assets/images/ins-1.png';
import insTwo from './../../assets/images/ins-2.png';
import insThree from './../../assets/images/ins-3.png';
import insFour from './../../assets/images/ins-4.png';
import './../../pages/UlrForm/UrlForm.css';

export default function FormInstruction() {

    const { t } = useTranslation();

    return (
        <div className='div-form-instruction'>
            <h1 className='sub-title'>{t('need-help-setting')}</h1>
            <div className='row instruction-div'>
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
    )

}