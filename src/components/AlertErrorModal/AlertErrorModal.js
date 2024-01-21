import React from 'react';
import './AlertErrorModal.css';
import { Modal, Button } from 'react-bootstrap';
import ButtonColored from '../ButtonColored/ButtonColored';
export default function AlertErrorModal(props) {
    const { show, handleClose } = props;
    const alertMessage = props.alertMessage;

    return (
        <Modal className='delete-modal' show={show} onHide={handleClose}>
            <Modal.Body className='modal-body'>
                <h1 className='alert-error-Title'>Prototype link required</h1>
                <h1 className='alert-error-message'> {alertMessage}</h1>
                <div className='container'>
                    <ButtonColored className="btn-notify-me" label="Got it" onClick={handleClose} />
                </div>
            </Modal.Body>
        </Modal >
    );
}