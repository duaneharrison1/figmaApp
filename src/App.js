import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UrlForm from './pages/UlrForm/UrlForm';
import EditForm from './pages/EditForm/EditForm';
import DynamicPage from './pages/DynamicPage';
import LandingPage from './pages/LandingPage/LandingPage';
import UserDashboard from './pages/UserDashboard/UserDashboard';
import { collection, getDocs } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { db, auth } from './firebase';
import ForgotPassword from './pages/Authentication/ForgotPassword/ForgotPasswordPage';
import Preview from './pages/Preview/Preview.js';
import Mainauth from './pages/Authentication/Mainauth';



function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user); // Set the user state
    });

    return () => unsubscribe(); // Clean up the listener when component unmounts
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = collection(db, "url");
        const snapshot = await getDocs(collectionRef);
        const fetchedData = snapshot.docs.map(doc => doc.data());
        setData(fetchedData);
        console.log(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);



  return (
    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<UrlForm />} />
        <Route path="/editform" element={<EditForm />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/auth" element={<Mainauth />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        {data.map((item) => (
          < Route path={`/${item.generatedUrl}`} element={<DynamicPage url={item} />} />
        ))}
      </Routes>
    </div>


  );
}
export default App;
