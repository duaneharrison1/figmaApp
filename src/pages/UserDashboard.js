import React from 'react';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Table } from 'react-bootstrap';
import { useNavigate, NavLink, useParams, Link } from 'react-router-dom';
import { signOut } from "firebase/auth";
import CardView from '../components/CardView/CardView';
import Button from '../components/Button/Button';

import DeleteModal from '../pages/Modal/DeleteModal/DeleteModal';


function UserDashboard() {
    const navigate = useNavigate();
    const { routeName } = useParams();
    const [data, setData] = useState([]);

    const [userId] = useAuthState(auth);
    const [user, setUser] = useState(null);

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Set the user state
        });

        return () => unsubscribe(); // Clean up the listener when component unmounts
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const user = auth.currentUser;
                    await getDocs(collection(db, "user", userId.uid, "url"))
                        .then((querySnapshot) => {
                            const newData = querySnapshot.docs
                                .map((doc) => ({ ...doc.data(), id: doc.id }));
                            setData(newData);
                            console.log(newData)
                        })

                } catch (error) {
                    console.error('Error fetching data:', error);
                }

            }
            else {
                console.log('No user data available');
            }
        };

        fetchData();
    }, [user]);


    const handleDelete = async (id) => {
        console.log({ id });
        try {
            await deleteDoc(doc(db, "user", user.uid, "url", id));
            console.log('Document successfully deleted!');
        } catch (error) {
            console.error('Error removing document: ', error);
        }
    };



    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    const goToEdit = (object) => {
        navigate('/editform', { state: { object } });
    }

    const openFigmaApp = (randomUrl) => {
        window.open('https://thriving-chaja-a2ee84.netlify.app/' + randomUrl, '_blank');
    }
    return (
        <>
            {!user ? (
                <h1> Login to access this page</h1>
            ) : (
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6'> </div>
                        <div className='col-md-6'>
                            <NavLink to="/form" >
                                <Button label='+ New site' />
                            </NavLink> </div>
                    </div>
                    <div className='row'>
                        {data.map(item => (
                            <div className='col-sm-4'>
                                <CardView siteTitle={item.title} url={item.generatedUrl} />
                                <button onClick={() => goToEdit(item)}>Update</button>
                                <button onClick={handleShowModal}>Delete</button>
                                <DeleteModal show={showModal} handleClose={handleCloseModal} id={item.id} />

                            </div>

                        ))}
                    </div>

                </div >
            )
            }
        </>
        // <>


        //     <div className='container'>
        //         <button onClick={handleLogout}>
        //             Logout
        //         </button>
        //         <Table>
        //             <thead>
        //                 <tr>
        //                     <th>id</th>
        //                     <th>Title</th>
        //                     <th>Custom Url</th>
        //                     <th>Figma Desktop Url</th>
        //                     <th>Figma Mobile Url</th>
        //                     <th>Update Data</th>
        //                     <th>Delete Data</th>
        //                     {/* Add more table headers for your data */}
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {/* n(db, "user", user.uid, "url", "mobile", "url") */}
        //                 {data.map(item => (
        //                     <tr key={item.id}>
        //                         <td>{item.id}</td>
        //                         <td>{item.title}</td>
        //                         <td>{item.generatedUrl}</td>
        //                         <td>{item.urls.figmaDesktopUrl}</td>
        //                         <td>{item.urls.figmaMobileUrl}</td>
        //                         <td>
        //                             <button onClick={() => handleDelete(item.id)}>Update</button>
        //                         </td>
        //                         <td>
        //                             <button onClick={() => handleDelete(item.id)}>Delete</button>
        //                         </td>
        //                     </tr>
        //                 ))}
        //             </tbody>
        //         </Table>
        //     </div>

        // </>
    );
}

export default UserDashboard;


