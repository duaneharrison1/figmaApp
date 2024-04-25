import React, { useState } from 'react';
import { auth, storage, upload, useAuth } from '../../firebase';
import { Modal } from 'react-bootstrap';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import './UploadImage.css'
import ButtonColored from '../ButtonColored/ButtonColored';
import { useTranslation } from 'react-i18next';
const DragAndDropImageUpload = (props) => {
    const { t } = useTranslation();
    const { show, handleClose } = props;
    const [imgUrl, setImgUrl] = useState(null);
    const userId = auth.currentUser;
    const currentUser = useAuth();


    const handleSubmit = (e) => {
        e.preventDefault()
        const file = e.target[0]?.files[0]
        setImgUrl(e.target[0]?.files[0])
        if (!file) return;

        const storageRef = ref(storage, `files/${userId.uid}/${userId.uid}.${file.name.split('.').pop()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("success")
                    window.location.reload();
                });
            },
            (error) => {
                alert(error);
            },

        );
    }

    function handleClick() {
        upload(imgUrl, currentUser);
    }
    // const onDrop = async (acceptedFiles) => {
    //     const selectedImage = acceptedFiles.target.files[0];
    //     setImage(selectedImage);
    // };

    // const uploadImage = async () => {
    //     if (!image) return;

    //     setUploading(true);

    //     try {
    //         const storageRef = ref(storage, `files/wew.jpg`);
    //         const uploadTask = uploadBytesResumable(storageRef, file);
    //         uploadTask.on("state_changed",
    //             (snapshot) => {
    //                 const progress =
    //                     Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    //                 setProgresspercent(progress);
    //             },
    //             (error) => {
    //                 alert(error);
    //             },

    //             () => {
    //                 console.log("success")
    //                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                     setImgUrl(downloadURL)
    //                 });
    //             }
    //         );
    //     } catch (error) {
    //         console.error('Error uploading image:', error);
    //     }

    //     setUploading(false);
    // };

    // const { getRootProps, getInputProps } = useDropzone({
    //     onDrop, accept: 'image/*', // Allow only image files
    //     multiple: false,
    // });
    function handleChange(e) {
        if (e.target.files[0]) {
            setImgUrl(e.target.files[0])
        }
    }
    return (
        <Modal className='upload-image-modal' show={show} onHide={handleClose}>
            <Modal.Body className='modal-body'>
                <div className="fields">
                    <input type="file" onChange={handleChange} />
                    <ButtonColored onClick={handleClick} label={t('upload')} className="edit-cancel-save-btn" />

                </div>
                {/* <form onSubmit={handleClick} className='form'>
                    <input type='file' />
                    <button type='submit'>Upload</button>
                </form> */}
                {/* <div>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag & drop an image here, or click to select one</p>
                    </div>
                    {image && (
                        <div>
                            <h2>Selected Image:</h2>
                            <img src={URL.createObjectURL(image)} alt="Selected" />
                            <button onClick={uploadImage} disabled={uploading}>
                                {uploading ? 'Uploading...' : 'Upload Image'}
                            </button>
                        </div>
                    )}
                </div> */}

                {/* <h1> Change avatar</h1>
                <div className="drag-drop-container">

                    <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()} />

                        {uploadedImage && (
                            <div className="preview">
                                <h3>Uploaded Image</h3>
                                <img src={uploadedImage} alt="Uploaded" />
                            </div>
                        )}
                        <p>Drag & drop or</p>
                        {/* <ButtonColored className="btn-upload-image" onClick={onDrop} label="Upload Image" /> */}



            </Modal.Body >
        </Modal >


    );
}

export default DragAndDropImageUpload;