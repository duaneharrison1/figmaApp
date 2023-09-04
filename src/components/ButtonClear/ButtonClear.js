
import React, { useState } from 'react';
import './ButtonClear.css';

export default function ButtonClear(props) {
    const onClick = props.onClick
    const label = props.label
    const className = props.className
    return (
        < button className={className} onClick={onClick}>
            {label}
        </button >
    )

}