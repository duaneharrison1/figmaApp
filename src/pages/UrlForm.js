import React, { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db, auth } from '../firebase';

export default function Home() {
    const [customUrl, setCustomUrl] = useState('');
    const [figmaUrl, setFigmaUrl] = useState('');
    const user = auth.currentUser;
    const handlecustomUrl = (event) => {
        setCustomUrl(event.target.value);
    };

    const handleFigmaUrl = (event) => {
        setFigmaUrl(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // await firebase.firestore().collection('users').doc(user.uid).set({
        //     email: user.email,
        //     // other user-related fields can be added here
        //   });
        const ref = collection(db, "user", user.uid, "url")
        const refUrl = collection(db, "url")
        let data = {
            figmaUrl: figmaUrl,
            customUrl: customUrl
        }
        try {
            addDoc(ref, data)
            addDoc(refUrl, data)
        } catch (err) {
            console.log(err)
        }
        setCustomUrl("")
        setFigmaUrl("")
    }

    return (
        <div>
            <h2>Hello world Form</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={customUrl}
                    placeholder='Custom Url'
                    onChange={handlecustomUrl}
                />

                <input
                    type="text"
                    placeholder='Figma Url'
                    value={figmaUrl}
                    onChange={handleFigmaUrl}
                />

                <button type="submit">Save</button>
            </form>
        </div>
    );
};

