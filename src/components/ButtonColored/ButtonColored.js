
import React, { useState } from 'react';
import './ButtonColored.css';

export default function ButtonColored(props) {
    const onClick = props.onClick
    const label = props.label
    const isDisabled = props.isDisabled
    const className = props.className

    return (
        isDisabled ?
            (< button className={className} disabled onClick={onClick} > {label}</button >)
            :
            (<button className={className} onClick={onClick} > {label}</button >)

    )

}