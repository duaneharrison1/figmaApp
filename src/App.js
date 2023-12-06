import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UrlForm from './pages/UlrForm/UrlForm';
import EditForm from './pages/EditForm/EditForm';
import DynamicPage from './pages/DynamicPage';
import DynamicPage2 from './pages/DynamicPage2.js';
import LandingPage from './pages/LandingPage/LandingPage';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import { collection, getDocs } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { db, auth } from './firebase';
import ForgotPassword from './pages/Authentication/ForgotPassword/ForgotpasswordPage';
import Preview from './pages/Preview/Preview.js';
import Mainauth from './pages/Authentication/MainAuth';

import ProfilePage from './pages/ProfilePage/ProfilePage';
import SignupPage from './pages/Authentication/SignupPage.js';



function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [isMainDomain, setIsMainDomain] = useState();
  const [customDomainData, setCustomDomainData] = useState();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Set the user state
    });

    return () => unsubscribe(); // Clean up the listener when component unmounts
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      var domain = window.location.host

      // if (domain != "figmafolio-stripe.vercel.app") {
      if (domain != "localhost:3000") {
        setIsMainDomain(false)
        console.log(domain)

      } else {
        setIsMainDomain(true)
        console.log(domain)
      }
      try {
        const collectionRef = collection(db, "url");
        const snapshot = await getDocs(collectionRef);
        const fetchedData = snapshot.docs.map(doc => doc.data());
        setData(fetchedData);
        for (var i = 0; i < fetchedData.length; i++) {
          var item = fetchedData[i];
          if (!isMainDomain && item.customDomain == domain && item.isDraft == "false") {
            setCustomDomainData(item)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

  }, [isMainDomain, customDomainData]

  );



  return (
    <div>
      {!isMainDomain ?
        <Routes>
          <Route path="/" element={<DynamicPage2 />} />
        </Routes>
        :
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/form" element={<UrlForm />} />
          <Route path="/editform" element={<EditForm />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/auth" element={<Mainauth />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/profile" element={<ProfilePage />} />
          {data.map((item) => (
            < Route path={`/${item.generatedUrl}`} element={<DynamicPage url={item} />} />
          ))}
        </Routes>
      }
    </div>


  );
}
export default App;
