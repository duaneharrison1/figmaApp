import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import UrlForm from './pages/UlrForm/UrlForm';
import EditForm from './pages/EditForm/EditForm';
import DynamicPage from './pages/DynamicPage/DynamicPage';
import DynamicPage2 from './pages/DynamicPage2.js';
import LandingPage from './pages/LandingPage/LandingPage';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import firebase from './firebase';
import ForgotPassword from './pages/Authentication/ForgotPassword/ForgotpasswordPage';
import Preview from './pages/Preview/Preview.js';
import Mainauth from './pages/Authentication/MainAuth';
import BillingPage from './pages/BillingPage/Billing.js';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.js';
import TermsAndConditions from './pages/TermsAndConditions/TermsAndConditions.js';
import PrivacyPolicy from './pages/Privacy Policy/PrivacyPolicy.js';
import i18n from './i18n';
import FolioForm from './pages/FolioForm/FolioForm.js';
import { app } from './firebase';
import 'firebase/analytics';
import { getAnalytics, logEvent } from "firebase/analytics";
function App() {
  const dbFirestore = firebase.firestore();
  const [data, setData] = useState([]);
  const [isMainDomain, setIsMainDomain] = useState("false");
  const [isDynamicPage, setIsDynamicPage] = useState("false");
  const analytics = getAnalytics();
  const location = useLocation();

  useEffect(() => {
    logEvent(analytics, 'page_view', {
      page_location: location.pathname,
      page_path: window.location.pathname,
    });
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      var domain = window.location.host
      var currentPath = window.location.pathname;
      var currentLanguage = i18n.language;
      if (domain == 'www.figmafolio.com' || domain == 'figma-app-tau.vercel.app' || domain == "localhost:3000") {
        setIsMainDomain("true")
        if (currentPath == '/' || currentPath == '/form' ||
          currentPath == '/admin' || currentPath == '/billing' ||
          currentPath == '/dashboard' || currentPath == '/preview' ||
          currentPath == '/auth' || currentPath == '/forgotpassword' ||
          currentPath == '/profile' ||
          currentPath == '/' + currentLanguage || currentPath == '/' + currentLanguage + '/form' ||
          currentPath == '/' + currentLanguage + '/admin' || currentPath == '/' + currentLanguage + '/billing' ||
          currentPath == '/' + currentLanguage + '/dashboard' || currentPath == '/' + currentLanguage + '/preview' ||
          currentPath == '/' + currentLanguage + '/auth' || currentPath == '/' + currentLanguage + '/forgotpassword' ||
          currentPath == '/' + currentLanguage + '/profile') {
          setIsDynamicPage("false")
        } else {
          setIsDynamicPage("true")
          try {
            var generatedUrl = currentPath.slice(1);
            dbFirestore.collectionGroup('url').where('generatedUrl', '==', generatedUrl).get().then(snapshot => {
              const fetchedData = snapshot.docs.map(doc => doc.data());
              setData(fetchedData);
            })
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      } else {
        setIsMainDomain("false")
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {isMainDomain == "false" ?
        <Routes>
          <Route path="/" element={<DynamicPage2 />} />
        </Routes>
        : isDynamicPage == "true" ?
          <Routes>
            {data.map((item) => (
              < Route path={`/${item.generatedUrl}`} element={<DynamicPage url={item} />} />
            ))}
          </Routes>
          :
          <Routes>
            <Route path="/billing" element={<FolioForm />} />
            <Route path="/:lang?/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* <Route path="/:lang?/billing" element={<BillingPage />} /> */}
            <Route path="/:lang?/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/:lang?/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/:lang?/new-folio" element={<FolioForm />} />
            <Route path="/:lang?/edit-folio" element={<FolioForm />} />
            <Route path="/:lang?/dashboard" element={<UserDashboard />} />
            <Route path="/:lang?/preview" element={<Preview />} />
            <Route path="/:lang?/auth" element={<Mainauth />} />
            <Route path="/:lang?/forgotpassword" element={<ForgotPassword />} />
            <Route path="/:lang?/profile" element={<ProfilePage />} />
          </Routes>
      }
    </div>
  );
}
export default App;

