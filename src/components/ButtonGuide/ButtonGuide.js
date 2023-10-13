
import React, { useState } from 'react';
import arrow_down from './../../assets/images/arrow-down.png';


export default function ButtonGuide(props) {
    const onClick = props.onClick
    const label = props.label
    const className = props.className
    return (
        < button className={className} onClick={onClick}>
            {label}
            <img src={arrow_down} />
        </button >
    )

}