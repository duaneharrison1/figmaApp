
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
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <p> Desktop</p>
                        <Form.Check
                            type="switch"
                            id="custom-switch"
                            label="Toggle Switch"
                            checked={isChecked}
                            onChange={handleSwitchChange}
                        />
                        <p> Mobile</p>
                    </div>
                </div>
            </div>

        </>
    );
}


