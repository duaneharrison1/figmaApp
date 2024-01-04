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
import ForgotPassword from './pages/Authentication/ForgotPassword/ForgotpasswordPage';
import Preview from './pages/Preview/Preview.js';
import Mainauth from './pages/Authentication/MainAuth';
import BillingPage from './pages/BillingPage/Billing.js';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SignupPage from './pages/Authentication/SignupPage.js';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard.js';



function App() {

  const [data, setData] = useState([]);
  const [sampleData, setSampleData] = useState([]);
  const [sampleSub, setSampleSub] = useState([]);
  const [user, setUser] = useState(null);
  const [isMainDomain, setIsMainDomain] = useState();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Set the user state
    });

    return () => unsubscribe(); // Clean up the listener when component unmounts
  }, []);


  useEffect(() => {
    const fetchData = async () => {

      try {
        await getDocs(collection(db, "user"))
          .then((querySnapshot) => {
            const userProfile = querySnapshot.docs
              .map((doc) => ({ ...doc.data(), id: doc.id }));
            setSampleData(userProfile)

            for (var i = 0; i < sampleData.length; i++) {
              var item = userProfile[i];
              getDocs(collection(db, "user", item.id, "subscriptions"))
                .then((querySnapshot) => {
                  const subscriptions = querySnapshot.docs
                    .map((doc) => ({ ...doc.data(), id: doc.id }));
                  setSampleSub(subscriptions)
                })
            }
          })
      } catch (error) {
        console.log(error)
      }

      var domain = window.location.host

      // if (!domain.includes('figmafolio-stripe.vercel.app')) {
      // if (domain != "localhost:3000") {
      if (domain == 'www.figmafolio.com' || domain == 'figma-app-tau.vercel.app') {
        setIsMainDomain(true)
        console.log(domain == 'figmafolio.com')
        console.log(domain)
        console.log('setIsMainDomain(true)')
      } else {
        setIsMainDomain(false)
        console.log(domain == 'figmafolio.com')
        console.log(domain)
        console.log('setIsMainDomain(false)')
      }
      try {
        const collectionRef = collectionGroup(db, "url");
        const snapshot = await getDocs(collectionRef);
        const fetchedData = snapshot.docs.map(doc => doc.data());
        setData(fetchedData);
        for (var i = 0; i < fetchedData.length; i++) {
          var item = fetchedData[i];
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

  }, [isMainDomain]

  );

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


      {!isMainDomain ?
        <Routes>
          <Route path="/" element={<DynamicPage2 />} />
        </Routes>
        :
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/billing" element={<BillingPage />} />
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

