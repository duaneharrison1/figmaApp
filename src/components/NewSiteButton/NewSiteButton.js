import React, { useState } from 'react';
import Modal from '../NewSiteButton/NewSiteButton';
import plusImage from '../../assets/images/plus.png';

function NewSiteButton(props) {
  const onClick = props.onClick;
  const className = props.className;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSiteTypeSelect = (siteType) => {
    console.log(`User selected to create a ${siteType} site`);
    setIsModalOpen(false);  
  };

  return (
    <div>
      <button className={className} onClick={() => setIsModalOpen(true)}>
        <img src={plusImage} alt="Icon" style={{ marginRight: '16px' }} />
        New site
      </button>

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)} 
          onSelect={handleSiteTypeSelect} 
        />
      )}
    </div>
  );
}

export default NewSiteButton;
