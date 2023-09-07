
import React, { useState } from 'react';
import './Button.css';

export default function Button(props) {
    const onClick = props.onClick
    const label = props.label
    const isDisabled = props.isDisabled
    const className = props.className
    return (
        { isDisabled } ?
            <button className={className} onClick={onClick}>{label}</button >
            :
            < button className="disabled" disabled={isDisabled} onClick={onClick}>{label}</button >


    )

}