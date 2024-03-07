
import React, { useState } from 'react';
import './ButtonClear.css';


export default function ButtonClear(props) {
    const onClick = props.onClick;
    const label = props.label;
    const className = props.className;
    const isDisabled = props.isDisabled;
    return (
        isDisabled ?
            (< button className={className} disabled onClick={onClick}>{label}</button >) :
            (< button className={className} onClick={onClick}> {label}</button >)
    )
}