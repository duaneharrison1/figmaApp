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
  const [faviconUrl, setFaviconUrl] = useState('');
  const dbFirestore = firebase.firestore();

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (faviconUrl) {
      link.href = faviconUrl;
    } else {
      link.href = '';
    }

    console.log("favicon" + faviconUrl);
  }, [faviconUrl]);

  useEffect(() => {
    var domain = window.location.host
    if (domain == 'www.figmafolio.com' || domain == 'figma-app-tau.vercel.app' || domain == 'localhost:3000') {
    } else {
      const fetchData = async () => {
        try {
          var domain = window.location.host
          const modifiedDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '');
          dbFirestore.collectionGroup('url').where('customDomain', '==', modifiedDomain).get().then(snapshot => {
            if (snapshot.docs.length === 0) {
              dbFirestore.collectionGroup('url').where('customDomain', '==', domain).get().then(snapshot => {
                const fetchedData = snapshot.docs.map(doc => doc.data());
                fetchedData.forEach((value) => {
                  dbFirestore.collection('user').doc(value.userId).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
                    if (snapshot.size === 0) {
                      console.log("wentHere1")
                    } else {
                      console.log("wentHere2")
                      snapshot.forEach(subscription => {
                        if (subscription.data().status === "active") {
                          if (value.isDraft == "false") {
                            document.title = value.title;
                            setFaviconUrl(value.faviconUrl)
                            setDesktop(value.urls.figmaDesktopUrl)
                            setMobile(value.urls.figmaMobileUrl)
                          }
                        }
                      }
                      )
                    }
                  })
                });
              })
            } else {
              console.log("wentHere3")
              const fetchedData = snapshot.docs.map(doc => doc.data());
              fetchedData.forEach((value) => {
                dbFirestore.collection('user').doc(value.userId).collection("subscriptions").orderBy('created', 'desc').limit(1).get().then(snapshot => {
                  if (snapshot.size === 0) {
                    console.log("wentHere4")
                  } else {
                    console.log("wentHere5")
                    snapshot.forEach(subscription => {
                      if (subscription.data().status === "active" || subscription.data().status == "trialing") {
                        console.log("wentHere6")
                        if (value.isDraft == "false") {
                          document.title = value.title;
                          setFaviconUrl(value.faviconUrl)
                          setDesktop(value.urls.figmaDesktopUrl)
                          setMobile(value.urls.figmaMobileUrl)
                        }
                      }
                    }
                    )
                  }
                })
              });
            }
          })
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [faviconUrl]
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
      className='dynamicpage_view_figma_view'></iframe>
  );
}

export default DynamicPage2;
