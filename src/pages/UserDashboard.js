import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs, doc, Timestamp, deleteDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Table } from 'react-bootstrap';
function UserDashboard() {

    const { routeName } = useParams();
    const [data, setData] = useState([]);

    const [user] = useAuthState(auth); // Get the currently logged-in user
    const [userData, setUserData] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const user = auth.currentUser;
                    await getDocs(collection(db, "user", user.uid, "url"))
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

    return (
        <div className='container'>
            <Table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Title</th>
                        <th>Custom Url</th>
                        <th>Figma Desktop Url</th>
                        <th>Figma Mobile Url</th>
                        <th>Update Data</th>
                        <th>Delete Data</th>
                        {/* Add more table headers for your data */}
                    </tr>
                </thead>
                <tbody>
                    {/* n(db, "user", user.uid, "url", "mobile", "url") */}
                    {data.map(item => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.title}</td>
                            <td>{item.generatedUrl}</td>
                            <td>{item.urls.figmaDesktopUrl}</td>
                            <td>{item.urls.figmaMobileUrl}</td>
                            <td>
                                <button onClick={() => handleDelete(item.id)}>Update</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

export default UserDashboard;


