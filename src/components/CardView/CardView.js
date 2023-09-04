import React from 'react';
import './CardView.css';
import cardView from '../../assets/images/cardView.png'
import 'bootstrap-icons/font/bootstrap-icons.css';

const CardView = (props) => {
    const siteTitle = props.siteTitle
    const url = props.url
    return (
        <>

            <div className="card">
                <a href={url} target="_blank">
                    <img src={cardView} alt="test" className="card-image" />
                </a >
                <h1 className='site-title'> {siteTitle}</h1>
                <i className="bi bi-three-dots-vertical"></i>
            </div >


        </>

    );
};
export default CardView;