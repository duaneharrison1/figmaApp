import React from 'react';

const Modal = ({ onClose, onSelect }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Select Site Type</h3>
        <div>
          <button onClick={() => onSelect('figma')}>Figma Site</button>
          <button onClick={() => onSelect('html')}>HTML Site</button>
        </div>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
