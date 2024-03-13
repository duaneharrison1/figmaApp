import React, { useState } from 'react';
import './TextField.css';

export default function TextField(props) {
    const label = props.label
    const className = props.className
    const id = props.id
    const name = props.name
    const type = props.type
    const placeholder = props.placeholder
    const formLabel = props.formLabel
    const onChange = props.onChange
    const handleChange = (event) => {
        onChange(event.target.value);
    };
    return (
        <>
            <h2 className='form-label'> {formLabel}</h2>
            <input className={className}
                id={id}
                name={name}
                type={type}
                required
                placeholder={placeholder}
                onChange={handleChange}
            />
        </>

    )
}




