import React from 'react';
import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, collectionGroup, Timestamp, query, orderBy } from 'firebase/firestore'
import './AdminDashboard.css'
import firebase from '../../firebase';
import { compareAsc, format } from "date-fns";
function AdminDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [profile, setProfile] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    // State for handling sorting
    const [sortOrder, setSortOrder] = useState('asc');
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    await getDocs(collection(db, "user", user.uid, "profile"))
                        .then((querySnapshot) => {
                            const userProfile = querySnapshot.docs
                                .map((doc) => ({ ...doc.data(), id: doc.id }));
                            setProfile(userProfile);
                        })
                    if (profile[0].isAdmin == "true") {
                        try {
                            const collectionRef = collectionGroup(db, "url");
                            const snapshot = await getDocs(query(collectionRef, orderBy('createdAt', 'desc')));
                            // const snapshot = await getDocs(collectionRef);
                            const fetchedData = snapshot.docs.map(doc => doc.data());
                            setData(fetchedData);
                            console.log("ff" + data)
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    } else {
                        navigate("/");
                    }

                } catch (error) {
                    console.error('Error fetching data:', error);
                }


            }
            else {
            }
        };
        fetchData();
    }, [user, profile]);




    return (
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

    );
}

export default AdminDashboard;


