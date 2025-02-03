import './App.css';
import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import firebase from './firebase';
import i18n from './i18n';
// import 'firebase/analytics';
// import { getAnalytics, logEvent } from "firebase/analytics";

// Lazy load components

const DynamicPage = lazy(() => import('./pages/DynamicPage/DynamicPage'));
const DynamicPage2 = lazy(() => import('./pages/DynamicPage2.js'));
const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const UserDashboard = lazy(() => import('./pages/UserDashboard/UserDashboard'));
const ForgotPassword = lazy(() => import('./pages/Authentication/ForgotPassword/ForgotpasswordPage'));
const Preview = lazy(() => import('./pages/Preview/Preview.js'));
const Mainauth = lazy(() => import('./pages/Authentication/MainAuth'));
const BillingPage = lazy(() => import('./pages/BillingPage/Billing.js'));
const ProfilePage = lazy(() => import('./pages/ProfilePage/ProfilePage'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard.js'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions/TermsAndConditions.js'));
const PrivacyPolicy = lazy(() => import('./pages/Privacy Policy/PrivacyPolicy.js'));
const FolioForm = lazy(() => import('./pages/FolioForm/FolioForm.js'));
const MobileFormInstruction = lazy(() => import('./pages/MobileForm/MobileInstructionForm/MobileFormInstruction.js'));
const MobileFormTitle = lazy(() => import('./pages/MobileForm/MobileFormTitle/MobileFormTitle.js'));
const MobileFormContent = lazy(() => import('./pages/MobileForm/MobileFormContent/MobileFormContent.js'));
const MobileFormDomain = lazy(() => import('./pages/MobileForm/MobileFormDomain/MobileFormDomain.js'));
const MobileFormFavicon = lazy(() => import('./pages/MobileForm/MobileFormFavicon/MobileFormFavicon.js'));
const MobileFormPassword = lazy(() => import('./pages/MobileForm/MobileFormPassword/MobileFormPassword.js'));
const MobileFormLabel = lazy(() => import('./pages/MobileForm/MobileFormLabel/MobileFormLabel.js'));
const PreviewFromPlugin = lazy(() => import('./pages/Preview/PreviewFromPlugin.js'));
const PluginAuth = lazy(() => import('./pages/Authentication/PluginAuth.js'));
const TestHtml = lazy(() => import('./pages/TestHtml.js'));

function App() {
  const { id } = useParams();
  const dbFirestore = firebase.firestore();
  const [data, setData] = useState([]);
  const [isMainDomain, setIsMainDomain] = useState("false");
  const [isDynamicPage, setIsDynamicPage] = useState("false");
  // const analytics = getAnalytics();
  const location = useLocation();

  // useEffect(() => {
  //   logEvent(analytics, 'page_view', {
  //     page_location: location.pathname,
  //     page_path: window.location.pathname,
  //   });
  // }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      var domain = window.location.host;
      var currentPath = window.location.pathname;
      var currentLanguage = i18n.language;
      if (domain == 'www.figmafolio.com' || domain == 'figma-app-tau.vercel.app' || domain == "localhost:3000") {
        setIsMainDomain("true");
        if (currentPath == '/' || currentPath == '/form' ||
          currentPath == '/admin' || currentPath == '/billing' ||
          currentPath == '/dashboard' || currentPath == '/preview' ||
          currentPath == '/auth' || currentPath == '/forgotpassword' ||
          currentPath == '/profile' ||
          currentPath == '/' + currentLanguage || currentPath == '/' + currentLanguage + '/form' ||
          currentPath == '/' + currentLanguage + '/admin' || currentPath == '/' + currentLanguage + '/billing' ||
          currentPath == '/' + currentLanguage + '/dashboard' || currentPath == '/' + currentLanguage + '/preview' ||
          currentPath == '/' + currentLanguage + '/auth' || currentPath == '/' + currentLanguage + '/plugin-auth' || currentPath == '/' + currentLanguage + '/forgotpassword' ||
          currentPath == '/' + currentLanguage + '/profile' || currentPath == '/' + currentLanguage + '/testpage') {
          setIsDynamicPage("false");
        } else if (currentPath.includes("folio-preview")) {
          setIsDynamicPage("false");
        } else {
          setIsDynamicPage("true");
          try {
            var generatedUrl = currentPath.slice(1);
            dbFirestore.collectionGroup('url').where('generatedUrl', '==', generatedUrl).get().then(snapshot => {
              const fetchedData = snapshot.docs.map(doc => doc.data());
              setData(fetchedData);
            });
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      } else {
        setIsMainDomain("false");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        {isMainDomain == "false" ?
          <Routes>
            <Route path="/" element={<DynamicPage2 />} />
          </Routes>
          : isDynamicPage == "true" ?
            <Routes>
              {data.map((item) => (
                <Route key={item.generatedUrl} path={`/${item.generatedUrl}`} element={<DynamicPage url={item} />} />
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
      </Suspense>
    </div>
  );
}

export default App;