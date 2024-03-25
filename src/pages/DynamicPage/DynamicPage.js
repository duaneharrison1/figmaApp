import React from 'react';
import { useState, useEffect } from 'react';
import './DynamicPage.css';
import firebase from '../../firebase';
function DynamicPage({ url }) {
  const dbFirestore = firebase.firestore();
  document.title = url.title;

  const [isMobile, setIsMobile] = useState(false);
  const [mobile, setMobile] = useState("");
  const [desktop, setDesktop] = useState("");
  const [activeSubscriber, setActiveSubscriber] = useState("");
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };


    dbFirestore.collection('user').doc(url.userId).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
      if (snapshot.size === 0) {
        setActiveSubscriber("false")
      } else {
        snapshot.forEach(subscription => {
          if (subscription.data().status == "active") {
            setActiveSubscriber("true")
          }
        }
        )
      }
    })

    if (url.urls.figmaMobileUrl === "") {
      setMobile(url.urls.figmaDesktopUrl)
    } else {
      setMobile(url.urls.figmaMobileUrl)
    }

    if (url.urls.figmaDesktopUrl === "") {
      setDesktop(url.urls.figmaMobileUrl)
    } else {
      setDesktop(url.urls.figmaDesktopUrl)
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);
  return (
    <>
      {activeSubscriber == "true" ? (<div></div>) :
        (<div className="text-overlay">
          <p className='made-with'>Made with <span className="made-with-figmaolio">Figmafolio</span></p>
        </div>)}
      <iframe
        src={isMobile ? mobile : desktop}
        allowFullScreen
        referrerpolicy="no-referrer"
        style={{ width: '100%', height: '100vh' }}
        className='dynamic_view_figma_view'>
      </iframe>
    </>

  );
}

export default DynamicPage;


