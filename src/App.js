import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UrlForm from './pages/UlrForm/UrlForm';
import EditForm from './pages/EditForm/EditForm';
import DynamicPage from './pages/DynamicPage';
import DynamicPage2 from './pages/DynamicPage2.js';
import LandingPage from './pages/LandingPage/LandingPage';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import { collection, collectionGroup, getDocs } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { db, auth } from './firebase';
import firebase from './firebase';
import ForgotPassword from './pages/Authentication/ForgotPassword/ForgotpasswordPage';
import Preview from './pages/Preview/Preview.js';
import Mainauth from './pages/Authentication/MainAuth';
import BillingPage from './pages/BillingPage/Billing.js';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SignupPage from './pages/Authentication/SignupPage.js';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.js';
import PrivacyPolicy from './pages/Privacy Policy/PrivacyPolicy.js';

function App() {
  const dbFirestore = firebase.firestore();
  const [data, setData] = useState([]);
  const [sampleData, setSampleData] = useState([]);
  const [sampleSub, setSampleSub] = useState([]);
  const [user, setUser] = useState(null);
  const [isMainDomain, setIsMainDomain] = useState("false");

  useEffect(() => {
    const fetchData = async () => {
      var domain = window.location.host
      var currentPath = window.location.pathname;
      if (domain == 'www.figmafolio.com' || domain == 'figma-app-tau.vercel.app' || domain == "localhost:3000") {
        setIsMainDomain("true")
        if (currentPath == '/' || currentPath == '/form' ||
          currentPath == '/admin' || currentPath == '/billing' ||
          currentPath == '/dashboard' || currentPath == '/preview' ||
          currentPath == '/auth' || currentPath == '/forgotpassword' ||
          currentPath == '/profile') {
          try {
            auth.onAuthStateChanged((user) => {
              setUser(user); // Set the user state
            });
          } catch (error) {
            console.log(error)
          }
        } else {
          console.log("yyy " + currentPath)
          try {
            var generatedUrl = currentPath.slice(1);
            console.log("yyy " + generatedUrl)
            dbFirestore.collectionGroup('url').where('generatedUrl', '==', generatedUrl).get().then(snapshot => {
              const fetchedData = snapshot.docs.map(doc => doc.data());
              setData(fetchedData);
            })
            console.log("it runs here")
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }

      } else {
        setIsMainDomain("false")
      }

    };
    fetchData();
    console.log("isMainDomain" + isMainDomain)
  }, []);

  return (
    <div>
      {/* <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/form" element={<UrlForm />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/editform" element={<EditForm />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/auth" element={<Mainauth />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfilePage />} />
        {data.map((item) => (
          < Route path={`/${item.generatedUrl}`} element={<DynamicPage url={item} />} />
        ))}
      </Routes> */}


      {isMainDomain == "false" ?
        <Routes>
          <Route path="/" element={<DynamicPage2 />} />
        </Routes>
        :
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
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

