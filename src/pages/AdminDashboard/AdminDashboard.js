import React from 'react';
import { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore'
import { useTable, useSortBy, usePagination } from 'react-table';
import TableComponent from '../../components/TableComponent/TableComponent';
function AdminDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [profile, setProfile] = useState();
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
                            const response = await axios.get(process.env.REACT_APP_URL_DATA);
                            setData(response.data.result)
                        } catch (error) {
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
    const columns = [
        {
            Header: 'Email',
            accessor: 'mainDoc.email',
        },
        {
            Header: 'Title',
            accessor: 'subcollectionUrlData[0].title', // Assuming there's always one item in subcollectionUrlData
        },
        {
            Header: 'Created At',
            accessor: 'subcollectionUrlData[0].createdAt', // Assuming there's always one item in subcollectionUrlData
        },
        {
            Header: 'Updated At',
            accessor: 'subcollectionUrlData[0].updatedAt', // Assuming there's always one item in subcollectionUrlData
        },
        {
            Header: 'Generated URL',
            accessor: 'subcollectionUrlData[0].generatedUrl',
        },
        {
            Header: 'Custom Domain',
            accessor: 'subcollectionUrlData[0].customDomain',
        },
        {
            Header: 'Draft',
            accessor: 'subcollectionUrlData[0].isDraft',
        },
        {
            Header: 'Figma Desktop URL',
            accessor: 'subcollectionUrlData[0].urls.figmaDesktopUrl',
        },
        {
            Header: 'Figma Mobile URL',
            accessor: 'subcollectionUrlData[0].urls.figmaMobileUrl',
        },
    ];


    return (

        <>    <table className='table table-bordered'>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Title</th>
                    <th>Generated Url</th>
                    <th>Custom Domain</th>
                    <th>Draft</th>
                    <th>Figma Desktop Url</th>
                    <th>Figma Mobile Url</th>
                    <th>Created At</th>
                    <th>Update At</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td>{item.mainDoc.email}</td>


                        <td>
                            {item.subcollectionUrlData.map((urlData, subIndex) => (
                                <div key={subIndex}>
                                    <p> {urlData.title}</p>
                                </div>
                            ))}
                        </td>

                        <td>
                            {item.subcollectionUrlData.map((urlData, subIndex) => (
                                <div key={subIndex}>
                                    <p> {urlData.generatedUrl}</p>
                                </div>
                            ))}
                        </td>

                        <td>
                            {item.subcollectionUrlData.map((urlData, subIndex) => (
                                <div key={subIndex}>
                                    <p> {urlData.customDomain}</p>
                                </div>
                            ))}
                        </td>

                        <td>
                            {item.subcollectionUrlData.map((urlData, subIndex) => (
                                <div key={subIndex}>
                                    <p> {urlData.isDraft}</p>
                                </div>
                            ))}
                        </td>

                        <td>
                            {item.subcollectionUrlData.map((urlData, subIndex) => (
                                <div key={subIndex}>
                                    <p> {urlData.urls.figmaDesktopUrl}</p>
                                </div>
                            ))}
                        </td>

                        <td>
                            {item.subcollectionUrlData.map((urlData, subIndex) => (
                                <div key={subIndex}>
                                    <p> {urlData.urls.figmaMobileUrl}</p>
                                </div>
                            ))}
                        </td>

                        <td>
                            {item.subcollectionUrlData.map((urlData, subIndex) => (
                                <div key={subIndex}>
                                    {/* <p> {new Date(urlData.createdAt._seconds * 1000).toLocaleDateString("en-US")}</p> */}

                                </div>
                            ))}
                        </td>

                        <td>
                            {item.subcollectionUrlData.map((urlData, subIndex) => (
                                <div key={subIndex}>
                                    {/* <p> {new Date(urlData.updatedAt._seconds * 1000).toLocaleDateString("en-US")}</p> */}
                                </div>
                            ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table></>


    );
}

export default AdminDashboard;


