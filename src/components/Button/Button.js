
import React, { useState } from 'react';
import './Button.css';

export default function Button(props) {
    const onClick = props.onClick
    const label = props.label
    const className = props.className
    return (
        < button className={className} onClick={onClick}>
            {label}
        </button >
    )

}