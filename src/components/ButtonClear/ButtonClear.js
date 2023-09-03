
import React, { useState } from 'react';
import './ButtonClear.css';

export default function ButtonClear(props) {
    const onClick = props.onClick
    const label = props.label
    return (
        < button className='btn-clear' onClick={onClick}>
            {label}
        </button >
    )

}