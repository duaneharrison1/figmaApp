import React from 'react';
import './CardView.css';
import cardView from '../../assets/images/cardView.png'

const CardView = (props) => {
    const siteTitle = props.siteTitle
    const url = props.url
    return (
        <>
            <a href={url} >
                <div className="card">
                    <img src={cardView} alt="test" className="card-image" />
                </div>
                <h1 className='site-title'> {siteTitle}</h1>
            </a>
        </>

    );
};
export default CardView;