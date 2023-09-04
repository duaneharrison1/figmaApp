import React from 'react';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import { signOut } from "firebase/auth";
import CardView from '../../components/CardView/CardView';
import Button from '../../components/Button/Button';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import './UserDashboard.css';

function UserDashboard() {
    const navigate = useNavigate();
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


    return (
        <>
            {!user ? (
                <h1> Login to access this page</h1>
            ) : (
                <div className='container'>
                    <div>
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-sm-6'>
                                <p>Published</p>
                                <p>Draft</p>
                            </div>
                            <div className='col-sm-6 new-site-div'>
                                <NavLink to="/form" >
                                    <Button label='+ New site' className="new-site" />
                                </NavLink> </div>
                        </div>
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
    );
}

export default UserDashboard;


