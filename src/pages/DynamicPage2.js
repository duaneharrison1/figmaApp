import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';
import axios from 'axios';

function DynamicPage2() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobile, setMobile] = useState("");
  const [desktop, setDesktop] = useState("");
  const [urlData, setUrlData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [outputValue, setOutputValue] = useState('');


  const removePrefix = () => {
    // Regular expression to check for "http://", "https://", or "www."

  };

  useEffect(() => {
    const fetchData = async () => {
      try {

        console.log("wew" + process.env.REACT_APP_URL_DATA)


        var domain = window.location.host
        const response = await axios.get(process.env.REACT_APP_URL_DATA); // replace with your API endpoint  
        response.data.result.forEach((mainDoc, index) => {
          mainDoc.subcollectionData.forEach((subData, subIndex) => {
            if (subData.status == "active") {
              if (subData.items[0].plan.id == process.env.REACT_APP_MONTHLY) {
                mainDoc.subcollectionUrlData.forEach((url, urlIndex) => {
                  setUrlData(url)
                  console.log("UrlData " + urlData)

                  const modifiedCustomDomain = url.customDomain.replace(/^(https?:\/\/)?(www\.)?/, '');
                  const modifiedDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');

                  // if (regex.test(url.customDomain)) {
                  //   const removedPrefix = url.customDomain.replace(regex, '');
                  //   setOutputValue(removedPrefix);
                  // } else {
                  //   setOutputValue(url.customDomain);
                  // }
                  if (modifiedCustomDomain == modifiedDomain) {
                    if (url.isDraft == "false") {
                      document.title = url.title;
                      setDesktop(url.urls.figmaMobileUrl)
                      setMobile(url.urls.figmaDesktopUrl)
                      console.log("wentHere: url.customDomain == domain")
                      console.log("wentHere:" + url.customDomain)
                      console.log("wentHere:" + domain)
                    }

                  } else {
                    console.log("error 1")
                    console.log("modifiedCustomDomain" + modifiedCustomDomain)
                    console.log("domain " + domain)

                  }
                });
              } else if (subData.items[0].plan.id == process.env.REACT_APP_YEARLY) {
                mainDoc.subcollectionUrlData.forEach((url, urlIndex) => {
                  setUrlData(url)
                  if (url.customDomain == domain) {
                    if (url.isDraft == "false") {
                      console.log("wentHere: url.customDomain == domain")
                      console.log("wentHere:" + url.customDomain)
                      console.log("wentHere:" + domain)
                      document.title = url.title;
                      setDesktop(url.urls.figmaMobileUrl)
                      setMobile(url.urls.figmaDesktopUrl)
                    }
                  } else {
                    console.log("error 2")
                  }
                });
              } else {
                console.log("error 3");
              }
            }
          });
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
      referrerpolicy="no-referrer"
      style={{ width: '100%', height: '100vh' }}
      className='dynamic_view_figma_view'></iframe>

  );
}

export default DynamicPage2;


