import React from 'react';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate, NavLink, useParams } from 'react-router-dom';
import { signOut } from "firebase/auth";
import CardView from '../../components/CardView/CardView';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import './UserDashboard.css';
import Navbar from '../../components/NavBar/Navbar';


function UserDashboard() {
    const [userIsDesktop, setUserIsDesktop] = useState(true);
    useEffect(() => {
        window.innerWidth > 1280 ? setUserIsDesktop(true) : setUserIsDesktop(false);
    }, [userIsDesktop]);




    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [profile, setProfile] = useState([]);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [draftCount, setDraftCount] = useState(0);
    const [publishCount, setPublishCount] = useState(0);
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

                    var publish = 0;
                    var draft = 0
                    await getDocs(collection(db, "user", user.uid, "url"))
                        .then((querySnapshot) => {

                            const newData = querySnapshot.docs
                                .map((doc) => ({ ...doc.data(), id: doc.id }));
                            setData(newData);

                            newData.forEach((value) => {
                                if (value.isDraft == "true") {
                                    console.log(draft++)
                                    setDraftCount(draft)
                                } else {
                                    setPublishCount(publish++)
                                }
                            });
                        })

                    await getDocs(collection(db, "user", user.uid, "profile"))
                        .then((querySnapshot) => {
                            const userProfile = querySnapshot.docs
                                .map((doc) => ({ ...doc.data(), id: doc.id }));
                            setProfile(userProfile);
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
    }, [user, draftCount, publishCount, profile]);

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
            // An error happened.
        });
    }

    const goToEdit = (object, profile) => {
        navigate('/editform', { state: { object, profile } });
    }

    const goToNewForm = () => {
        navigate('/form');
        // navigate('/form', { state: { profile } });
    }

    return (
        <>

            <div>

                {!profile ?
                    < Navbar className={"dashboardNavBar"} email={" "} onClickLogout={handleLogout} isFromForm={false} />
                    :
                    <div>
                        {profile.map(profile => (
                            < Navbar className={"dashboardNavBar"} email={profile.name} onClickLogout={handleLogout} isFromForm={false} />
                        ))}
                    </div>
                }

                <div className='dashboard-view'>
                    <div>

                        <ButtonColored label='+ New site' className="new-site" onClick={goToNewForm}>
                        </ButtonColored>

                    </div>

                    <div className='row'>
                        {data.map(item => (
                            <div className='col-sm-4'>
                                <CardView figmaMobileUrl={item.urls.figmaMobileUrl} figmaDesktopUrl={item.urls.figmaDesktopUrl} siteTitle={item.title} url={item.generatedUrl} isDraft={item.isDraft} onClickDelete={handleShowModal} onClickUpdate={() => goToEdit(item, profile)} />
                                <DeleteModal show={showModal} handleClose={handleCloseModal} id={item.id} generatedUrl={item.generatedUrl} />
                            </div>
                        ))}
                    </div>
                </div >
            </div >

        </>
    );
}

export default UserDashboard;


