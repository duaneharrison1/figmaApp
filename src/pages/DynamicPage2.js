import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, doc, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import firebase from '../firebase';
function DynamicPage2() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobile, setMobile] = useState("");
  const [desktop, setDesktop] = useState("");
  const [urlData, setUrlData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [outputValue, setOutputValue] = useState('');
  const dbFirestore = firebase.firestore();

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = 'https:v=2';
  }, []);

  useEffect(() => {

    var domain = window.location.host
    if (domain == 'www.figmafolio.com' || domain == 'figma-app-tau.vercel.app' || domain == 'localhost:3000') {
      console.log("wentHerezzzz")
    } else {
      const fetchData = async () => {
        console.log("wentHerexxx")
        try {
          var domain = window.location.host
          console.log("domain " + domain)
          const modifiedDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
          dbFirestore.collectionGroup('url').where('customDomain', '==', modifiedDomain || domain).get().then(snapshot => {
            const fetchedData = snapshot.docs.map(doc => doc.data());

            fetchedData.forEach((value) => {
              console.log("figmalink " + value.urls.figmaDesktopUrl)
              console.log("figmalink " + value.urls.figmaMobileUrl)
              if (value.isDraft == "false") {
                document.title = value.title;
                setDesktop(value.urls.figmaDesktopUrl)
                setMobile(value.urls.figmaMobileUrl)
              }
            });
            console.log("finish getting data");
          })

          // const response = await axios.get(process.env.REACT_APP_URL_DATA);
          // response.data.result.forEach((mainDoc, index) => {
          //   mainDoc.subcollectionData.forEach((subData, subIndex) => {
          //     if (subData.status == "active") {
          //       if (subData.items[0].plan.id == process.env.REACT_APP_MONTHLY) {
          //         mainDoc.subcollectionUrlData.forEach((url, urlIndex) => {
          //           setUrlData(url)

          //           const modifiedCustomDomain = url.customDomain.replace(/^(https?:\/\/)?(www\.)?/, '');
          //           const modifiedDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
          //           if (modifiedCustomDomain == modifiedDomain) {
          //             if (url.isDraft == "false") {
          //               document.title = url.title;
          //               setDesktop(url.urls.figmaDesktopUrl)
          //               setMobile(url.urls.figmaMobileUrl)
          //             }
          //             console.log("finish getting data");
          //           } else {
          //             console.log("error");
          //           }
          //         });
          //       } else if (subData.items[0].plan.id == process.env.REACT_APP_YEARLY) {
          //         mainDoc.subcollectionUrlData.forEach((url, urlIndex) => {
          //           setUrlData(url)
          //           if (url.customDomain == domain) {
          //             if (url.isDraft == "false") {

          //               document.title = url.title;
          //               setDesktop(url.urls.figmaDesktopUrl)
          //               setMobile(url.urls.figmaMobileUrl)
          //             }
          //           } else {
          //             console.log("error 2")
          //           }
          //         });
          //       } else {
          //         console.log("error 3");
          //       }
          //     }
          //   });
          // });
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
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


