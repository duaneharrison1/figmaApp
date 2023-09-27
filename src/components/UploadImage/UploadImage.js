import React, { useState, useEffect } from 'react';
import { db, auth, storage } from '../../firebase';
import { Modal } from 'react-bootstrap';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { useDropzone } from 'react-dropzone';
import './UploadImage.css'
import ButtonColored from '../ButtonColored/ButtonColored';
const DragAndDropImageUpload = (props) => {
    const { show, handleClose } = props;
    const [user, setUser] = useState(null);
    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);
    const userId = auth.currentUser;

    // const handleDrop = async (e) => {
    //     console.log("wewew" + userId)
    //     e.preventDefault();
    //     const file = e.target[0]?.files[0]

    //     console.log(file)

    //     if (!file) return;

    //     const storageRef = ref(storage, `files/${userId / file}`);
    //     const uploadTask = uploadBytesResumable(storageRef, file);

    //     uploadTask.on("state_changed",
    //         (snapshot) => {
    //             const progress =
    //                 Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    //             setProgresspercent(progress);
    //         },
    //         (error) => {
    //             alert(error);
    //         },
    //         () => {
    //             getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                 setImgUrl(downloadURL)
    //             });
    //         }
    //     );
    // };

    const [uploadedImage, setUploadedImage] = useState(null);

    const onDrop = async (e) => {
        const file = e.target[0]?.files[0]
        console.log("wewew" + userId)
        const storageRef = ref(storage, `files/${userId.uid + ".jpg"}`);

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress =
                    Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgresspercent(progress);
            },
            (error) => {
                alert(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImgUrl(downloadURL)
                });
            }
        );
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <Modal className='upload-image-modal' show={show} onHide={handleClose}>
            <Modal.Body className='modal-body'>
                <h1> Change avatar</h1>
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
                        <ButtonColored className="btn-upload-image" onClick={onDrop} label="Upload Image" />

                    </div>


                    {/* <form onSubmit={handleDrop} className='form'>
                        <input type='file' />
                        <button type='submit'>Upload</button>
                    </form>
                    {
                        !imgUrl &&
                        <div className='outerbar'>
                            <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
                        </div>
                    }
                    {
                        imgUrl &&
                        <img src={imgUrl} alt='uploaded file' height={200} />
                    } */}
                </div>

            </Modal.Body>
        </Modal >


    );
}

export default DragAndDropImageUpload;