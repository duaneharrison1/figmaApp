import React, { useState } from 'react';
import './PlanCard.css';
import { ReactComponent as CheckIcon } from '../../assets/svg/check.svg';

export default function PlanCard(props) {
    return (
        <div className='container plan-card'>
            <h1> Free</h1>

            <h1> $0 / month</h1>

            <h2> <CheckIcon />
                1 Projects/Websites</h2>
            <h2> <CheckIcon />
                1 Projects/Websites</h2>
            <h2> <CheckIcon />
                1 Projects/Websites</h2>


        </div >



    )

}