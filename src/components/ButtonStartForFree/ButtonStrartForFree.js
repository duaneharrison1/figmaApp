
import React, { useState } from 'react';

import arrow_right from './../../assets/images/arrow-right.png';
export default function ButtonStartForFree(props) {
    const onClick = props.onClick
    const label = props.label
    const className = props.className

    return (
        < button className={className} onClick={onClick} > {label} <img src={arrow_right} /> </button >
    )

}