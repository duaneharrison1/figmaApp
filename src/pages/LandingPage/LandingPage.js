import React from 'react';
import { useState, useEffect } from 'react';
import './LandingPage.css';
import landing_page from './../../assets/images/landing_page.png';
import Footer from '../../components/Footer/Footer';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Button from '../../components/Button/Button';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
export default function LandingPage() {

  const navigate = useNavigate();
  const [userId] = useAuthState(auth);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);


  return (<>
    {user ? (
      navigate("/dashboard")
    ) : (
      < div className='container-fluid main-landing-page'>
        <div className='nav-bar'>
          <div className="row">
            <div className="col-sm-8">
              <h4 className='figmalio'> Figmafolio</h4>
            </div>
            <div className="col-sm-4 d-flex justify-content-end">

              <NavLink to="/auth" >
                <button className='btn-go-to-app' >Log in/ Sign up</button>
              </NavLink>

            </div>
          </div>
        </div>


        <div className='container'>
          <div className='row'>
            <div className='col-6'>
              <h1 className='landing-header'>Seamless Showcase: Unify Your Prototypes with a Custom URL</h1>
              <h1 className='landing-subheader'> No coding required</h1>
              <h1 className='landing-sec-subheader'>With Figmafolio, you can effortlessly combine your desktop and mobile prototypes created in Figma into a cohesive showcase, all under your own custom URL. Ditch the hassle of separate links and enjoy a seamless browsing experience on both desktop and mobile devices.</h1>
              <div className='row btn_column'>
                <div className='col-6 text-end'>
                  <Button className="start-for-free-btn" label='Start for Free' />
                </div>
                <div className='col-6'>
                  <ButtonClear className="guide-btn" label='Guide' />
                </div>
              </div>
            </div>
            {/* <div className='col-6'>
              <img src={landing_page} />
            </div> */}
          </div>
        </div>


        <div className='container main-container'>

          <div className='container'>
            <h2 className='guide-one-header'> Custome domain and website title</h2>
            <h3 className='guide-one-subheader'>You are free to create your website name and domain!</h3>

          </div>

          <div className='container'>
            <h3 className='guide-one-header'>Review your website and publish</h3>
            <h4 className='guide-one-subheader'> All for free! Create your website now!</h4>
          </div>
        </div>

        <Footer />
      </div>
    )
    }
  </>
  )

}