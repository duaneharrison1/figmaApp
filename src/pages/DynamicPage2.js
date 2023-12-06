import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';

function DynamicPage2() {

  // document.title = url.title;
  const [isMobile, setIsMobile] = useState(false);
  const [mobile, setMobile] = useState("");
  const [desktop, setDesktop] = useState("");
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        var domain = window.location.host
        const collectionRef = collection(db, "url");
        const snapshot = await getDocs(collectionRef);
        const fetchedData = snapshot.docs.map(doc => doc.data());
        setData(fetchedData);
        for (var i = 0; i < fetchedData.length; i++) {
          var item = fetchedData[i];
          if (item.customDomain == domain && item.isDraft == "false") {
            console.log("xxx domain = " + domain)
            console.log("xxx item.customDomain = " + item.customDomain)
            console.log("xxx item.isDraft =" + item.isDraft)
            document.title = item.title;
            setDesktop(item.urls.figmaMobileUrl)
            setMobile(item.urls.figmaDesktopUrl)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

  }, []

  );
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





  return (

    <iframe
      src={isMobile ? mobile : desktop}
      allowFullScreen
      style={{ width: '100%', height: '100vh' }}
      className='dynamic_view_figma_view'></iframe>

  );
}

export default DynamicPage2;


