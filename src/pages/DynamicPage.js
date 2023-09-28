import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';

function DynamicPage({ url }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };


    handleResize();


    window.addEventListener('resize', handleResize);


    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  console.log("wew1" + url.urls.figmaDesktopUrl);
  console.log("wew2" + url.urls.figmaMobileUrl);

  { isMobile ? <p>Mobile View</p> : <p>Desktop View</p> }

  return (
    <iframe
      src={isMobile ? url.urls.figmaMobileUrl : url.urls.figmaDesktopUrl}
      allowFullScreen
      style={{ width: '100vh', height: '100vh' }}
      className='figma_view'></iframe>
  );
}

export default DynamicPage;


