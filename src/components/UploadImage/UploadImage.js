import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';


const DragAndDropImageUpload = (props) => {
    const { show, handleClose } = props;
    const [image, setImage] = useState(null);

    const handleDrop = async (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            // Upload the dropped file to Firebase Storage
            try {
                const storageRef = firebase.storage().ref();
                const imageRef = storageRef.child('images/${file.name}');
                await imageRef.put(file);

                // Get the download URL of the uploaded image
                const downloadUrl = await imageRef.getDownloadURL();

                console.log('Image uploaded successfully:', downloadUrl);
            } catch (error) {
                console.error('Error uploading image:', error.message);
            }

            setImage(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <Modal className='delete-modal' show={show} onHide={handleClose}>
            <Modal.Body className='modal-body'>
                <div
                    className="drag-drop-container"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    <div className="drop-area">
                        <p>Drag and drop an image here to upload</p>
                    </div>
                    {image && (
                        <div className="image-preview">
                            <img src={image} alt="Preview" />
                        </div>
                    )}
                </div>
            </Modal.Body>
        </Modal >


    );
}

export default DragAndDropImageUpload;