
import React, { useState } from 'react';
import './PreviewSwitch.css';
import Switch from 'react-bootstrap/Switch';
import Form from 'react-bootstrap/Form';
export default function PreviewSwitch() {
    const [isChecked, setIsChecked] = useState(false);
    const handleSwitchChange = () => {
        setIsChecked(!isChecked);
        console.log(isChecked)
    };

    return (
        <div container="preview-switch-container">
            <h1 className='preview-switch-header'>Preview</h1>
            <div className='switch-container'>
                <p>Desktop</p>
                {/* <Form.Check
                    type="switch"
                    id="custom-switch"
                    checked={isChecked}
                    onChange={handleSwitchChange}
                /> */}

                <Form.Check
                    type="switch"
                    id="custom-switch"

                />
                <p> Mobile</p>
            </div>
        </div>

    );
}


