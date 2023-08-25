import './App.css';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UrlForm from './pages/UrlForm';
import DynamicPage from './pages/DynamicPage';
import Signup from './pages/authentication/signup';
import Login from './pages/authentication/login';
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import { db } from './firebase';
import { collection, getDocs } from "firebase/firestore";
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
    //   {data.map(item => (
    //     <tr key={item.id}>
    //         <td>{item.customUrl}</td>
    //         <td>{changeUrlString(item.figmaUrl)}</td>
    //     </tr>
    // ))}

    <div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/form" element={<UrlForm />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {data.map((item) => (

          < Route path={`/${item.customUrl}`} element={<DynamicPage url={item} />} />
        ))}

      </Routes>

      {/* <div>
        <label>Create Custom Route: </label>
        <input
          type="text"
          value={newRoute}
          onChange={handleInputChange}
        />
        <Link to={`/custom/${newRoute}`}>Create</Link>
      </div> */}
    </div>


  );
}
// function CustomRoute({ match }) {
//   return <h2>Custom Route: {match.params.customRoute}</h2>;
// }

export default App;
