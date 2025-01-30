import React, { useState } from 'react';
import plusImage from '../../assets/images/plus.png';

function NewSiteButton(props) {
    const { onClick, className } = props;
    const [showModal, setShowModal] = useState(false);

    const handleButtonClick = () => {
        setShowModal(true); // Show the modal when the button is clicked
    };

    const handleSiteTypeSelection = (siteType) => {
        setShowModal(false); // Hide the modal
        onClick(siteType); // Pass the selected site type to the parent component
    };

    return (
        <>
            <button className={className} onClick={handleButtonClick}>
                <img src={plusImage} alt="Icon" style={{ marginRight: '16px' }} />
                New site
            </button>

            {/* Site Type Selection Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center',
                    }}>
                        <h3>Choose Site Type</h3>
                        <button
                            onClick={() => handleSiteTypeSelection('figma')}
                            style={{
                                margin: '10px',
                                padding: '10px 20px',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                        >
                            Figma Site
                        </button>
                        <button
                            onClick={() => handleSiteTypeSelection('html')}
                            style={{
                                margin: '10px',
                                padding: '10px 20px',
                                fontSize: '16px',
                                cursor: 'pointer',
                            }}
                        >
                            HTML Site
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{
                                margin: '10px',
                                padding: '10px 20px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                backgroundColor: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default NewSiteButton;