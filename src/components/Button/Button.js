
import React, { useState } from 'react';
import './Button.css';

export default function Button(props) {
    const onClick = props.onClick
    const label = props.label
    return (
        < button className='btn-block' onClick={onClick}>
            {label}
        </button >
    )

}