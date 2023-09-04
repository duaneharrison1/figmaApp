import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import UrlForm from '../pages/UlrForm/UrlForm';
const Home = () => {


    return (
        <>
            {/* <nav>
                <p>
                    Welcome Home
                </p>
                <UrlForm />
                
            </nav> */}
        </>
    )
}

export default Home;