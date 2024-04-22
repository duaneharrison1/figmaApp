import React, { useState, useRef  } from 'react';
import { t } from 'i18next';
import i18n from '../../i18n';
import ButtonColored from '../ButtonColored/ButtonColored';
import ButtonClear from '../ButtonClear/ButtonClear';
export default function FormFavicon() {
    const [imgUrl, setImgUrl] = useState(null);
    const [image, setImage] = useState(null)
    const inputFile = useRef(null);
    const currentLanguage = i18n.language;
    function handleChange(e) {
        if (e.target.files[0]) {
            setImgUrl(e.target.files[0])
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    }

    const onButtonClick = (e) => {
        // `current` points to the mounted file input element
        inputFile.current && inputFile.current.click();
  
      };
    return (
        <>
         <div className='row first-div'>
                            <h1 className='form-title'>Favicon</h1>
                            <p className='form-favicon-note'>This is a small icon which will represent your website at the top of a web browser and in browser's bookmark bar, history and in search results.</p>
                                <h2 className='form-sub-header'>Website Icon</h2>
                                <img src={image} alt="Selected" className='favicon-prev' />
                                <ButtonClear className='btn-clear' onClick={onButtonClick} label="Upload image"/>
      <input
        type="file"
        accept="image/*"
        id="file"
        ref={inputFile}
        onChange={handleChange} 
        style={{ display: "none" }}
      />
                            <p className='form-favicon-note'>Submit a PNG, JGP or SVG which is at least 70px x 70px. For best results, use an image which is 260px x 260px or more. </p>
                        </div>
        </>
    );
}