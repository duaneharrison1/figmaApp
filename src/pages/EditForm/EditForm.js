import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import './EditForm.css';
import Button from '../../components/Button/Button';

export default function EditForm() {
    const location = useLocation();
    const [figmaDesktopUrl, setDesktopCustomUrl] = useState(location.state.object.urls.figmaMobileUrl);
    const [figmaMobileUrl, setfigmaMobileUrl] = useState(location.state.object.urls.figmaMobileUrl);
    const [title, setTitle] = useState(location.state.object.title);
    const userId = auth.currentUser;
    const [user, setUser] = useState(null);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Set the user state
        });

        return () => unsubscribe(); // Clean up the listener when component unmounts
    }, []);

    const handlefigmaDesktopUrl = (event) => {
        setDesktopCustomUrl(event.target.value);
    };
    const handlefigmaMobileUrl = (event) => {
        setfigmaMobileUrl(event.target.value);
    };

    const handleTitle = (event) => {
        setTitle(event.target.value);
    };


    const handleUpdate = async (event) => {
        event.preventDefault();
        console.log(userId.uid);
        try {
            const ref = doc(db, "user", userId.uid, "url", location.state.object.id)
            await updateDoc(ref, {
                title: title,
                urls: { figmaDesktopUrl, figmaMobileUrl }
            });
            console.log('Document updated successfully');
        } catch (error) {
            console.error('Error updating document:', error);
        }
    };

    return (

        <>

            <div className='container'>
                <div className="card url-form">
                    <form onSubmit={handleUpdate}>
                        <div className="container">
                            <div className="row first-div">
                                <div className="col-md-6">
                                    <div className="row">
                                        <h1 className='title'>General</h1>
                                        <h2 className='sub-header'>Site Title</h2>
                                        <input
                                            className='input'
                                            type="text"
                                            placeholder='Title'
                                            value={title}
                                            // value={location.state.object.title}
                                            onChange={handleTitle} />
                                    </div>
                                </div>
                            </div>

                            <div className='container'>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <h1 className='title'>Free domain</h1>
                                        <h1 className='free-domain-name'>Figmafolio</h1>
                                    </div>
                                    <div className='col-md-6'>
                                        <Button label='Upgrade plan' />
                                    </div>
                                </div>
                            </div>

                            <div className='container'>
                                <h4 className='add-dns-content'>
                                    Add the DNS records to your domain name.A-record for @ (or yourdomain.com) and www to 5.161.34.112You can add a new record in your domain registrar DNS manager.Make sure you add an entry for both @ and www
                                </h4>
                            </div>

                            <div className='container second-div'>
                                <h1 className='title'>Enter figma prototype links</h1>
                                <h3 className='automatically-point-content'> We’ll automatically point the site to the correct prototype.</h3>
                            </div>

                            <div className="container">
                                <div className="row gx-5">
                                    <div className="col-md-6">
                                        <div className="row">
                                            <h2 className='sub-header'>
                                                Desktop
                                            </h2>
                                            <input
                                                className='input'
                                                type="text"
                                                placeholder='Custom Desktop Url'
                                                value={figmaDesktopUrl}
                                                // value={location.state.object.urls.figmaDesktopUrl}
                                                onChange={handlefigmaDesktopUrl}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="row">
                                            <h2 className='sub-header'>
                                                Mobile
                                            </h2>
                                            <input
                                                className='input'
                                                type="text"
                                                placeholder='Custom Mobile Url'
                                                value={figmaMobileUrl}
                                                // value={location.state.object.urls.figmaMobileUrl}
                                                onChange={handlefigmaMobileUrl}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='container'>
                            <Button label='Preview' type="submit" />
                        </div>

                    </form >
                </div>
            </div>
        </>

        // <>
        //     {!user ? (
        //         <h1> Login to access this page</h1>
        //     ) : (
        //         <div className='container'>
        //             <h1 className='title'>General</h1>
        //             <input
        //                 className='input'
        //                 type="text"
        //                 placeholder='Title'
        //                 value={title}
        //                 onChange={handleTitle} />

        //             <form onSubmit={handleSubmit}>
        //                 <div className="container">
        //                     <div className="row first-div">
        //                         <div className="col-md-6">
        //                             <div className="row">
        //                                 <h1 className='title'>Free domain</h1>
        //                                 <h2 className='sub-header'>Title</h2>
        //                                 <input
        //                                     className='input'
        //                                     type="text"
        //                                     placeholder='Title'
        //                                     value={title}
        //                                     onChange={handleTitle} />
        //                             </div>
        //                         </div>

        //                         <div className="col-md-6">
        //                             <h1 className='title'>Custom domain</h1>
        //                             <div className="row">
        //                                 <h2 className='sub-header'>Domain name</h2>
        //                                 <input
        //                                     className='input'
        //                                     type="text"
        //                                     placeholder='Domain name' />
        //                             </div>

        //                         </div>
        //                         <div className='container'>
        //                             <h4 className='add-dns-content'>
        //                                 Add the DNS records to your domain name.A-record for @ (or yourdomain.com) and www to 5.161.34.112You can add a new record in your domain registrar DNS manager.Make sure you add an entry for both @ and www
        //                             </h4>
        //                         </div>
        //                     </div>
        //                 </div>


        //                 <div className='container second-div'>
        //                     <h1 className='title'>Enter figma prototype links</h1>

        //                     <h3 className='automatically-point-content'> We’ll automatically point the site to the correct prototype.</h3>
        //                 </div>


        //                 <div className="container">
        //                     <div className="row">
        //                         <div className="col-md-6">
        //                             <div className="row">
        //                                 <h2 className='sub-header'>
        //                                     Desktop
        //                                 </h2>


        //                                 <input
        //                                     className='input'
        //                                     type="text"
        //                                     placeholder='Custom Desktop Url'
        //                                     value={figmaDesktopUrl}
        //                                     onChange={handlefigmaDesktopUrl}
        //                                 />

        //                             </div>
        //                         </div>

        //                         <div className="col-md-6">
        //                             <div className="row">
        //                                 <h2 className='sub-header'>
        //                                     Mobile
        //                                 </h2>
        //                                 <input
        //                                     className='input'
        //                                     type="text"
        //                                     placeholder='Custom Mobile Url'
        //                                     value={figmaMobileUrl}
        //                                     onChange={handlefigmaMobileUrl}
        //                                 />
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <button
        //                     className='btn-sign-in'
        //                     type="submit">
        //                     Save changes
        //                 </button>
        //             </form >
        //         </div >
        //     )
        //     }
        // </>

    );
};

