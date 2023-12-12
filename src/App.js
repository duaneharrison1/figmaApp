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

import ProfilePage from './pages/ProfilePage/ProfilePage';
import SignupPage from './pages/Authentication/SignupPage.js';



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







                  // for (var i = 0; i < subscriptions.length; i++) {
                  //   var subscriptionitem = subscriptions[i];
                  //   console.log("subscriptions " + subscriptions.length)
                  //   if (subscriptionitem.status == "active") {
                  //     getDocs(collection(db, "user", item.id, "urlTest"))
                  //       .then((querySnapshot) => {
                  //         const url = querySnapshot.docs
                  //           .map((doc) => ({ ...doc.data(), id: doc.id }));
                  //         console.log("url.length " + url.length)
                  //         for (var i = 0; i < url.length; i++) {
                  //           var urlData = url[i];
                  //           console.log("urlData " + urlData.title)
                  //         }
                  //       })
                  //   }
                  // }
                })
            }
          })
      } catch (error) {
        console.log(error)
      }

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
