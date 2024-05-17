import React, { useState, useEffect } from 'react';
import { t } from 'i18next';
import i18n from '../../../i18n';
import '.././MobileForm.css'
import ButtonColored from '../../../components/ButtonColored/ButtonColored';
import { useNavigate, useLocation } from 'react-router-dom';
import firebase from '../../../firebase';
import { auth } from '../../../firebase';
import Footer from '../../../components/Footer/Footer';

export const MobileFormTitle = (props) => {
    const currentLanguage = i18n.language;
    const dbFirestore = firebase.firestore();
    const user = auth.currentUser;
    const location = useLocation();
    const [randomurl, setRandomUrl] = useState('');
    const [docId, setDocId] = useState(location && location.state && location.state.object? location.state.object.id: "");
    const [generatedUrl, setGeneratedUrl] = useState(location && location.state && location.state.object && location.state.object.generatedUrl? location.state.object.generatedUrl: "");
    const navigate = useNavigate();
    function generateRandomString(length) {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            result += chars[randomIndex];
        }
        return result;
    }
    useEffect(() => {
        const handlePopState = () => {
            // URL changed!
            console.log("change");
        };

        window.addEventListener("popstate", handlePopState);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []); 

    useEffect(() => {
        setRandomUrl(generateRandomString(10))
        const fetchData = async () => {
            try {
                dbFirestore.collectionGroup('url').where('generatedUrl', '==', randomurl).get().then(snapshot => {
                    if (snapshot.docs.length !== 0) {
                        setRandomUrl(generateRandomString(10))
                        console.log("secondRandomUrl " + randomurl)
                    }
                })
            } catch (error) {
                console.error("error" + error);
            }
        };
        fetchData();
    }, []);

    const [title, setTitle] = useState(
        location && location.state && location.state.object && location.state.object.title
            ? location.state.object.title
            : ""
    );

 const handleTitle = (event) => {
        setTitle(event.target.value);
    };


    const saveTitle = async () => {
        try {
            if (docId) {
                const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").doc(docId).update({
                    title: title,
                    updatedAt: new Date()
                })
            } else {
                const docRef = await dbFirestore.collection('user').doc(user.uid).collection("url").add({
                    userId: user.uid,
                    title: title,
                    isDraft: "false",
                    generatedUrl: randomurl,
                    createdAt: new Date(),
                })
                setGeneratedUrl(randomurl);
                setDocId(docRef.id);
            }
        } catch (err) {
            alert(err.message)
        } finally {
            alert("Success")
        }
    }

    return (
        <>
        <div className='app-wrapper-mobile'>
            <div className='mobile-form-title-container'>
                <h1 className='form-title'>{t('general')}</h1>
                <h2 className='form-sub-header'>{t('title')}</h2>
                <input
                    className='form-input'
                    type="text"
                    placeholder={t('enter-your-site-name')}
                    value={title}
                    onChange={handleTitle}
                />
                <p className='form-title-notes'> This will set the title of your whole website as it appears at the top of the browser window and in search engines.</p>

                <ButtonColored className="mobile-folio-form-save-btn" label={"Save"} onClick={saveTitle} />

            </div>
            <Footer/>
            </div>
        </>
    )
}
