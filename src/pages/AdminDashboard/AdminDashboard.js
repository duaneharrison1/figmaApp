import React from 'react';
import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore'
import './AdminDashboard.css'
import firebase from '../../firebase';

function AdminDashboard() {
    const dbFirestore = firebase.firestore();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [profile, setProfile] = useState();
    const [page, setPage] = useState(1);
    const [isAdmin, setIsAdmin] = useState();

    useEffect(() => {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = "https://firebasestorage.googleapis.com/v0/b/figmawebapp.appspot.com/o/figmafolio-favicon.png?alt=media&token=3b9cc2d9-01c6-470e-910a-a64c168ed870?v=2";
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        if (user) {
            try {
                getDocs(collection(db, "user", user.uid, "profile"))
                    .then((querySnapshot) => {
                        const userProfile = querySnapshot.docs
                            .map((doc) => ({ ...doc.data(), id: doc.id }));
                        setProfile(userProfile);
                        if (userProfile[0].isAdmin == "true") {
                            fetchData()
                        } else {
                            navigate("/");
                        }
                    })
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        else {
        }
        return () => unsubscribe();
    }, [user]);


    const fetchData = async () => {
        try {
            dbFirestore.collectionGroup('url').orderBy('createdAt', 'desc').limit(10).onSnapshot(function (querySnapshot) {
                var items = [];
                querySnapshot.forEach(function (doc) {
                    items.push({ key: doc.id, ...doc.data() });
                });
                setData(items);
            })
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const showNext = ({ item }) => {
        if (data.length === 0) {
            alert("Thats all we have for now !")
        } else {
            const fetchNextData = async () => {
                await dbFirestore.collectionGroup('url')
                    .orderBy('createdAt', 'desc')
                    .limit(10)
                    .startAfter(item.createdAt)
                    .onSnapshot(function (querySnapshot) {
                        const items = [];
                        querySnapshot.forEach(function (doc) {
                            items.push({ key: doc.id, ...doc.data() });
                        });
                        setData(items);
                        setPage(page + 1)
                    })
            };
            fetchNextData();
        }
    };

    const showPrevious = ({ item }) => {
        const fetchPreviousData = async () => {
            await dbFirestore.collectionGroup('url')
                .orderBy('createdAt', 'desc')
                .endBefore(item.createdAt)
                .limitToLast(10)
                .onSnapshot(function (querySnapshot) {
                    const items = [];
                    querySnapshot.forEach(function (doc) {
                        items.push({ key: doc.id, ...doc.data() });
                    });
                    setData(items);
                    setPage(page - 1)
                })
        };
        fetchPreviousData();
    };

    return (
        <div className='admin-main-div'>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Generated Url</th>
                        <th>Custom Domain</th>
                        <th>Draft</th>
                        <th>Created At</th>
                        <th>Update At</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>{item.title}</td>
                            <td>  <a href={`${item.generatedUrl}`} target="_blank" rel="noopener noreferrer">
                                {`www.figmafolio/${item.generatedUrl}`}
                            </a></td>
                            <td>{item.customDomain}</td>
                            <td>{item.isDraft}</td>
                            <td>{new Date(item?.createdAt?.seconds * 1000).toLocaleDateString("en-US")}</td>
                            <td>{new Date(item?.updatedAt?.seconds * 1000).toLocaleDateString("en-US")}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


            <div className='button-container'>
                {
                    page === 1 ? '' :
                        <button className='admin-paginate-btn'
                            onClick={() => showPrevious({ item: data[0] })}>
                            Previous
                        </button>
                }

                {
                    data.length < 10 ? '' :
                        <button className='admin-paginate-btn'
                            onClick={() => showNext({ item: data[data.length - 1] })}>
                            Next
                        </button>
                }
            </div>
        </div>
    );
}

export default AdminDashboard;







