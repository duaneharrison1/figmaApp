import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';
import axios from 'axios';

function DynamicPage2() {

  // document.title = url.title;
  const [isMobile, setIsMobile] = useState(false);
  const [mobile, setMobile] = useState("");
  const [desktop, setDesktop] = useState("");
  const [urlData, setUrlData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        var domain = window.location.host
        const response = await axios.get('https://us-central1-figmawebapp.cloudfunctions.net/getCollectionAndSubcollection'); // replace with your API endpoint  
        response.data.result.forEach((mainDoc, index) => {
          console.log("email" + mainDoc.mainDoc.email);

          // Loop through each subcollection data
          mainDoc.subcollectionData.forEach((subData, subIndex) => {
            if (subData.status == "active") {
              console.log("status" + subData.status);
              if (subData.items[0].plan.id == process.env.REACT_APP_MONTHLY) {
                mainDoc.subcollectionUrlData.forEach((url, urlIndex) => {
                  setUrlData(url)
                  console.log("urlData " + url.customDomain)
                  if (url.customDomain == "www.test3.com") {
                    document.title = urlData.title;
                    setDesktop(url.urls.figmaMobileUrl)
                    setMobile(url.urls.figmaDesktopUrl)
                  } else {
                    console.log("error")
                  }
                });
              } else if (subData.items[0].plan.id == process.env.REACT_APP_YEARLY) {
                mainDoc.subcollectionUrlData.forEach((url, urlIndex) => {
                  setUrlData(url)
                  console.log("wwww" + urlData.title);
                });
              } else {
                console.log("error");
              }
            }
          });

          console.log(); // Add a newline for better readability
        });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
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


