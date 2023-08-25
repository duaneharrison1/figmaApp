import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';


function UserDashboard() {

    const { routeName } = useParams();
    const [data, setData] = useState([]);

    const targetItemId = 'je2Pf6QPfgkBYAPO5xIB';
    const user = auth.currentUser;
    // const ref = collection(db,"user",user.uid,"url")
    //collection(db,"user",user.uid,"url")
    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectionRef = collection(db, "user", "j3752Zk9OrYO4RGfTWsn0hZsQPD3", "url");
                const snapshot = await getDocs(collectionRef);
                const fetchedData = snapshot.docs.map(doc => doc.data());
                setData(fetchedData);
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    // function changeUrlString(figma_url) {
    //     let searchString = "https";
    //     let replacementString = "https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2F";
    //     let newUrl = figma_url.replace(searchString, replacementString);
    //     return newUrl;
    // }

    return (<>
        <table>
            <thead>
                <tr>
                    <th>Custom Url</th>
                    <th>Figma Url</th>

                    {/* Add more table headers for your data */}
                </tr>
            </thead>
            <tbody>
                {data.map(item => (
                    <tr key={item.id}>
                        <td>{item.customUrl}</td>
                        {/* <td>{changeUrlString(item.figmaUrl)}</td> */}
                    </tr>
                ))}
            </tbody>
        </table>
    </>
    );
}

export default UserDashboard;


