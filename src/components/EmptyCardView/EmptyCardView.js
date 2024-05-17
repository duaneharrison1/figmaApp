import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
import ButtonColored from '../ButtonColored/ButtonColored';
import NewSiteButton from '../NewSiteButton/NewSiteButton';

export default function EmptyCardView(props) {
    const currentLanguage = i18n.language;
    const { t } = useTranslation();

return(

    <>
      <div className="card preview-card"  onClick={props.goToNewForm}>
                
                    <div className='empty-figmaThumbnail'>
                        <div className="empty-card-container">
                        <h1 className="new-site-cardview-header"> Add new site</h1>
                        <h1 className="new-site-cardview-subheader"> Start building your website or portfolio now </h1>

                        <NewSiteButton className="empty-card-new-site-btn">
                                                    </NewSiteButton>
                             </div>
                      
                    </div>
           
            </div >
    </>
);

    
};
