import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';

function DynamicPage({ url }) {

  document.title = url.title;
  const [isMobile, setIsMobile] = useState(false);
  const [mobile, setMobile] = useState("");
  const [desktop, setDesktop] = useState("");
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    if (url.urls.figmaMobileUrl == "") {
      setMobile(url.urls.figmaDesktopUrl)
    } else {
      setMobile(url.urls.figmaMobileUrl)
    }

    if (url.urls.figmaDesktopUrl == "") {
      setDesktop(url.urls.figmaMobileUrl)
    } else {
      setDesktop(url.urls.figmaDesktopUrl)
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);




  console.log("wew1" + url.urls.figmaDesktopUrl);
  console.log("wew2" + url.urls.figmaMobileUrl);
  console.log("wew3" + desktop);
  console.log("wew4" + mobile);
  return (

    <iframe
      src={isMobile ? mobile : desktop}
      allowFullScreen
      style={{ width: '100%', height: '100vh' }}
      className='dynamic_view_figma_view'></iframe>

  );
}

export default DynamicPage;


