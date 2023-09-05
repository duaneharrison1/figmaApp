import React from 'react';
import './CardView.css';
import cardView from '../../assets/images/cardView.png'
import 'bootstrap-icons/font/bootstrap-icons.css';

const CardView = (props) => {
    const siteTitle = props.siteTitle
    const url = props.url
    const onClickDelete = props.onClickDelete
    const onClickUpdate = props.onClickUpdate
    return (
        <>
            <div className="card">
                <a href={url} target="_blank">
                    <img src={cardView} alt="test" className="card-image" />
                </a >
                <div className="holder d-flex justify-content-between">
                    <div>
                        <h1 className='site-title'> {siteTitle}</h1>
                    </div>
                    <div>
                        <div className="dropdown">
                            <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg width="12" height="14" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                                </svg>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-dark bg-light">
                                <li><a className="dropdown-item" onClick={onClickUpdate}>Update</a></li>
                                <li><a className="dropdown-item text-danger" onClick={onClickDelete}>Delete</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div >


        </>

    );
};
export default CardView;