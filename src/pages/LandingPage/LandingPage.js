import React from 'react';
import { useState, useEffect } from 'react';
import './LandingPage.css';
import landing_page from './../../assets/images/landing_page.png';
import stepOne from './../../assets/images/stepOne.png';
import stepTwo from './../../assets/images/stepTwo.png';
import stepThree from './../../assets/images/stepThree.png';
import Footer from '../../components/Footer/Footer';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
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


  return (
    <>

      < div className='container-fluid main-landing-page'>
        <div className='nav-bar'>
          <div className='container'>
            <div className="row">
              <div className="col-sm-8">
                <h4 className='figmalio'> Figmafolio</h4>
              </div>
              <div className="col-sm-4 d-flex justify-content-end">
                {user ?
                  <div className="button-container">
                    <Link to="/dashboard" >
                      <ButtonColored className="signup-btn" label='Go to app' />
                    </Link>
                  </div>
                  :
                  <div className="button-container">
                    <Link to="/auth" className='login-link' state={{ "name": "tab1" }}>Login</Link>
                    <Link to="/auth" state={{ "name": "tab2" }} >
                      <ButtonColored className="signup-btn" label='Sign Up' />
                    </Link>
                  </div>
                }
              </div>
            </div>
          </div>
        </div >


        <div className='container'>
          <div className='row main-header'>
            <div className='col-6'>
              <h1 className='landing-header'>Seamless Showcase: Unify Your Prototypes with a Custom URL</h1>
              <h1 className='landing-subheader'> No coding required</h1>
              <h1 className='landing-sec-subheader'>With Figmafolio, you can effortlessly combine your desktop and mobile prototypes created in Figma into a cohesive showcase, all under your own custom URL. Ditch the hassle of separate links and enjoy a seamless browsing experience on both desktop and mobile devices.</h1>
              <div className='row btn_column'>
                <div className='col-6 text-end'>
                  <ButtonColored className="start-for-free-btn" label='Start for Free &rarr;' />
                </div>
                <div className='col-6'>
                  <ButtonClear className="guide-btn" label='Guide &darr;' />
                </div>
              </div>
            </div>
            <div className='col-6'>
              <img src={landing_page} />
            </div>
          </div>
        </div>


        <div className='container-fluid main-container'>
          <div className='container guide-container'>
            <div className='container header-guid-container'>
              <div className='circular-container'>
                <div class="circular-background">
                  <div class="step-text">1</div>
                </div>
              </div>
              <div className='container guide-text-container'>
                <h2 className='guide-one-header'> All you need is your prototype links!</h2>
                <h3 className='guide-one-subheader'>You just need to provide your 2 versions of prototype which are Mobile and Desktop and leave the rest for us!</h3>
              </div>
            </div>
            <div className='img-container'>
              <img src={stepOne} className='step-one-img' />
            </div>

          </div>

          <div className='container guide-container'>
            <div className='container-fluid'>

              <div className='row'>
                <div className='col-4 wew'>
                  <div className="circular-background">
                    <div className="step-text">2</div>
                  </div>
                </div>
                <div className='col-8'>
                  <div className='container-fluid guide-two'>
                    <h3 className='guide-two-header '>Custome domain and website title</h3>
                    <h4 className='guide-two-subheader '> You are free to create your website name and domain!</h4>
                  </div>
                </div>


              </div>


            </div>
          </div>


          {/* <div className='img-container'>
            <img src={stepTwo} className='step-one-img' />
          </div> */}
          <div className='container guide-container'>
            <div className='container header-guid-container'>
              <div className='circular-container'>
                <div class="circular-background">
                  <div class="step-text">3</div>
                </div>
              </div>
              <div className='container guide-text-container'>
                <h3 className='guide-one-header'>Review your website and publish</h3>
                <h4 className='guide-one-subheader'> All for free! Create your website now!</h4>
              </div>
            </div>
            <div className='img-container'>
              <img src={stepThree} className='step-one-img' />
              <div className='container'>
                <ButtonColored className="start-for-free-btn-second" label='Start for Free &darr;' />
              </div>
            </div>
          </div>

          <div className='container guide-container-plan'>
            <h3 className='guide-one-header'>Plan</h3>
          </div>

        </div>


      </div >
      <Footer />
    </>
  )

}