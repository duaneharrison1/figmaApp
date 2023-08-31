import './App.css';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UrlForm from './pages/UlrForm/UrlForm';
import DynamicPage from './pages/DynamicPage';
import Signup from './pages/authentication/SignUpPage';
import Login from './pages/authentication/LoginInPage';
import LandingPage from './pages/LandingPage/LandingPage';
import UserDashboard from './pages/UserDashboard';
import { db } from './firebase';
import { collection, getDocs } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  const [data, setData] = useState([]);
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
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {data.map((item) => (
          < Route path={`/${item.generatedUrl}`} element={<DynamicPage url={item} />} />
        ))}
      </Routes>
    </div>


  );
}
export default App;
