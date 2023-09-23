import React from 'react';
import './CardView.css';
import cardView from '../../assets/images/cardView.png'
import 'bootstrap-icons/font/bootstrap-icons.css';

const CardView = (props) => {
    const isDraft = props.isDraft
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
                    <div className='container d-flex'>
                        <h1 className='site-title'> {siteTitle}</h1>
                        {isDraft == "false" ? <h1 className='published'> Published</h1> : <h1 className='draft'> Draft</h1>}
                    </div>
                    <div>
                        <div className="dropdown">
                            <button class="btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
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