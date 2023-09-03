import React from 'react';
import './AlertModal.css';
import { Modal, Button } from 'react-bootstrap';

export default function AlertModal(props) {
    const { show, handleClose } = props;
    const alertMessage = props.alertMessage;

    return (
        <Modal className='delete-modal' show={show} onHide={handleClose}>
            <Modal.Body className='modal-body'>
                <h1> {alertMessage}</h1>
            </Modal.Body>
            <Modal.Footer>
                <div className='container'>
                    <button onClick={handleClose}>
                        Close
                    </button>
                </div>
            </Modal.Footer >
        </Modal >
    );
}