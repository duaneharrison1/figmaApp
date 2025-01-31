import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
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
import MobileFormInstruction from './pages/MobileForm/MobileInstructionForm/MobileFormInstruction.js';
import { MobileFormTitle } from './pages/MobileForm/MobileFormTitle/MobileFormTitle.js';
import { MobileFormContent } from './pages/MobileForm/MobileFormContent/MobileFormContent.js';
import { MobileFormDomain } from './pages/MobileForm/MobileFormDomain/MobileFormDomain.js';
import { MobileFormFavicon } from './pages/MobileForm/MobileFormFavicon/MobileFormFavicon.js';
import { MobileFormPassword } from './pages/MobileForm/MobileFormPassword/MobileFormPassword.js';
import { MobileFormLabel } from './pages/MobileForm/MobileFormLabel/MobileFormLabel.js';
import PreviewFromPlugin from './pages/Preview/PreviewFromPlugin.js';
import PluginAuth from './pages/Authentication/PluginAuth.js';
import TestHtml from './pages/TestHtml.js';
function App() {
  const { id } = useParams()
  const dbFirestore = firebase.firestore();
  const [data, setData] = useState([]);
  const [isMainDomain, setIsMainDomain] = useState("false");
  const [isDynamicPage, setIsDynamicPage] = useState("false");
  const analytics = getAnalytics();
  const location = useLocation();

  //test

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
          currentPath == '/' + currentLanguage + '/auth' || currentPath == '/' + currentLanguage + '/plugin-auth' || currentPath == '/' + currentLanguage + '/forgotpassword' ||
          currentPath == '/' + currentLanguage + '/profile' || currentPath == '/' + currentLanguage + '/testpage' ) {
          setIsDynamicPage("false")
        } else if (currentPath.includes("folio-preview")) {
          setIsDynamicPage("false")
        }

        else {
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
            <Route path="/:lang?/" element={<LandingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/:lang?/billing" element={<BillingPage />} />
            <Route path="/:lang?/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/:lang?/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/:lang?/folio-form" element={<FolioForm />} />
            <Route path="/:lang?/dashboard" element={<UserDashboard />} />
            <Route path="/:lang?/testpage" element={<TestHtml />} />
            <Route path="/:lang?/preview" element={<Preview />} />
            <Route path="/:lang?/folio-preview/:id" element={<PreviewFromPlugin />} />
            <Route path="/:lang?/auth" element={<Mainauth />} />
            <Route path="/:lang?/plugin-auth" element={<PluginAuth />} />
            <Route path="/:lang?/forgotpassword" element={<ForgotPassword />} />
            <Route path="/:lang?/profile" element={<ProfilePage />} />
            <Route path="/:lang?/mobile-instruction" element={<MobileFormInstruction />} />
            <Route path="/:lang?/mobile-form-title" element={<MobileFormTitle />} />
            <Route path="/:lang?/mobile-form-content" element={<MobileFormContent />} />
            <Route path="/:lang?/mobile-form-domain" element={<MobileFormDomain />} />
            <Route path="/:lang?/mobile-form-password" element={<MobileFormPassword />} />
            <Route path="/:lang?/mobile-form-label" element={<MobileFormLabel />} />
            <Route path="/:lang?/mobile-form-favicon" element={<MobileFormFavicon />} />
          </Routes>
      }
    </div>
  );
}
export default App;

