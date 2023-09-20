import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { EyeSlashFill, EyeFill } from 'react-bootstrap-icons';
import './PasswordTextfield.css';

export default function Wew(props) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const label = props.label
    const className = props.className
    const id = props.id
    const name = props.name
    const type = props.type
    const placeholder = props.placeholder
    const formLabel = props.formLabel
    const onChange = props.onChange
    const handleChange = (event) => {
        // Call the provided onChange function with the new value
        onChange(event.target.value);
    }

    // <input className={className}
    // id={id}
    // name={name}
    // type={type}
    // required
    // placeholder={placeholder}
    // onChange={handleChange}
    return (<>
        <h2 className='form-label'> {formLabel}</h2>
        <InputGroup>
            <FormControl
                id={id}
                name={name}
                className={className}
                type={showPassword ? 'text' : 'password'}
                value={password}
                required
                placeholder={placeholder}
                onChange={handleChange}
            />
            <Button

                onClick={togglePasswordVisibility}
            >
                {showPassword ? <EyeSlashFill /> : <EyeFill />}
            </Button>
        </InputGroup >
    </>
    )
}