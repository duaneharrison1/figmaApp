import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import main_header_image from './../../assets/images/main-header-image.png';
import stepOne from './../../assets/images/stepOne.png';
import guideOne from './../../assets/images/guide_one_image.png';
import guideTwo from './../../assets/images/guide_two_image.png';
import guideThree from './../../assets/images/guide_three_image.png';
import one from './../../assets/images/one.png';
import two from './../../assets/images/two.png';
import three from './../../assets/images/three.png';
import stepTwo from './../../assets/images/stepTwo.png';
import stepThree from './../../assets/images/stepThree.png';
import Footer from '../../components/Footer/Footer';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
export default function LandingPage() {
  const divGuide = useRef(null);
  const navigate = useNavigate();
  const [userId] = useAuthState(auth);
  const [user, setUser] = useState(null);
  const scrollToDiv = () => {
    divGuide.current.scrollIntoView({ behavior: 'smooth' });
  }
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const [userIsDesktop, setUserIsDesktop] = useState(true);
  useEffect(() => {
    window.innerWidth > 1280 ? setUserIsDesktop(true) : setUserIsDesktop(false);
  }, [userIsDesktop]);

  return (
    <>

      {!userIsDesktop ? (
        < div className='container-fluid main-landing-page'>
          <div className='navbar-container'>
            <div class="row">
              <div class="col m-0 p-0">
                {user ?
                  <h4 className='figmalio-logged'> Figmafolio</h4 >
                  :
                  <h4 className='figmalio-guest'> Figmafolio</h4 >
                }
              </div>
              <div class="col m-0 p-0">
                {user ?
                  <div className="button-container">
                    <Link to="/dashboard" >
                      <ButtonColored className="signup-btn" label='Go to app' />
                    </Link>
                  </div>
                  :
                  <div className="button-container">
                    <Link to="/auth" className='login-link' state={{ "name": "tab1" }}>Sign in/ Sign up</Link>
                  </div>
                }
              </div>
            </div>
          </div >


          <div className='container mobile-first-div'>
            <h1 className='landing-header'>Seamless Showcase: Unify Your Prototypes with a Custom URL</h1>
            <h1 className='landing-subheader'> No coding required</h1>
            <h1 className='landing-sec-subheader'>With our platform, you can effortlessly combine your desktop and mobile prototypes created in Figma into a cohesive showcase, all under your own custom URL. Ditch the hassle of separate links and enjoy a seamless browsing experience on both desktop and mobile devices.</h1>

            <ButtonColored className="start-for-free-btn" label='Start for Free' />
            <ButtonClear className="guide-btn" label='Guide &darr;' />

            <img className="landing-page-img" src={main_header_image} />

          </div>

          <div className='container guide-container'>
            <div className='container header-guide-container'>
              <div className='row'>
                <div className='col-2 circle-img-container'>
                  <img src={one} className='step-one' />
                </div>
                <div className='col-10'>
                  <div className='container guide-text-container'>
                    <h2 className='guide-one-header'> All you need is your prototype links!</h2>
                    <h3 className='guide-one-subheader'>You just need to provide your 2 versions of prototype which are Mobile and Desktop and leave the rest for us!</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className='img-container'>
              <img src={stepOne} className='step-one-img' />
            </div>

            <div className='container header-guide-container'>
              <div className='row'>
                <div className='col-2 circle-img-container'>
                  <img src={two} className='step-one' />
                </div>
                <div className='col-10'>
                  <div className='container guide-text-container'>
                    <h2 className='guide-one-header '> Custome domain and website title</h2>
                    <h3 className='guide-one-subheader'>You are free to create your website name and domain</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className='img-container'>
              <img src={stepTwo} className='step-one-img' />
            </div>

            <div className='container header-guide-container'>
              <div className='row'>
                <div className='col-2 circle-img-container'>
                  <img src={three} className='step-one' />
                </div>
                <div className='col-10'>
                  <div className='container guide-text-container'>
                    <h2 className='guide-one-header'> Review your website and publish</h2>
                    <h3 className='guide-one-subheader'>All for free! Create your website now!</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className='img-container'>
              <img src={stepThree} className='step-one-img' />
            </div>
            <Link to="/auth" state={{ "name": "tab2" }} >
              <ButtonColored className="start-for-free-btn-second" label='Start for Free &darr;' />
            </Link>
          </div>
        </div >
      ) : (
        < div className='container-fluid main-landing-page m-0 p-0'>
          <div className='navbar-container'>
            <div className="row">
              <div className="col-sm-8">
                {user ?
                  <h4 className='figmalio-logged'> Figmafolio</h4 >
                  :
                  <h4 className='figmalio-guest'> Figmafolio</h4 >
                }
              </div >
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
              </div >
            </div >
          </div >

          <div className='page-content-container'>
            <div className='row main-header'>
              <div className='col-6'>
                <h1 className='landing-header'>Figma file to live site in one click</h1>

                <h1 className='landing-sec-subheader'>You can publish an interactive website or portfolio directly from your Figma, no coding necessary.</h1>

                <div className='row btn_column '>
                  <div className='col-md-10 m-0 p-0'>
                    <Link to="/auth" state={{ "name": "tab2" }} >
                      <ButtonColored className="start-for-free-btn-second" label='Start for Free &darr;' />
                    </Link>
                    <ButtonClear onClick={scrollToDiv} className="guide-btn" label='Guide &darr;' />
                  </div>
                </div>

              </div>
              <div className='col-6'>
                <img className="landing-page-img" src={main_header_image} />
              </div>
            </div>
          </div>

          <div className='landing-page-guide-container'>

            <div className='row guide-container-version-two'>
              <div className='col-6'>
                <img src={guideOne} className='step-one-img' />
              </div>
              <div className='col-6'>
                <div className='row'>
                  <div className='col-2'>
                    <img src={one} className='step-one' />
                  </div>
                  <div className='col-10'>
                    <h2 className='guide-one-header'> Design in Figma</h2>
                    <h3 className='guide-one-subheader'>Skip learning other tools or coding. Bring your entire website or portfolio to life right in Figma. Leverage its features like transitions, GIFs and video to make it interactive and engaging.</h3>
                  </div>
                </div>

              </div>
            </div>
            <div className='row guide-container-version-two'>
              <div className='col-6'>
                <div className='row'>
                  <div className='col-2'>
                    <img src={two} className='step-one' />
                  </div>
                  <div className='col-10'>
                    <h2 className='guide-one-header'>Simple setup</h2>
                    <h3 className='guide-one-subheader'>Sign up and paste in your Figma prototype links for both desktop and mobile views - this ensures your site works for anyone visiting. Preview the site to see your fantastic Figma designs brought to life.</h3>
                  </div>
                </div>

              </div>
              <div className='col-6'>
                <img src={guideTwo} className='step-one-img' />
              </div>
            </div>
            <div className='row '>
              <div className='col-6'>
                <img src={guideThree} className='step-one-img' />
              </div>
              <div className='col-6'>
                <div className='row'>
                  <div className='col-2'>
                    <img src={three} className='step-one' />
                  </div>
                  <div className='col-10'>
                    <h2 className='guide-one-header'>Go live!</h2>
                    <h3 className='guide-one-subheader'>Publish your site instantly to start securing jobs and clients faster. Updates made in Figma are reflected on your site instantly. Customize your site with a personalised domain name.</h3>
                  </div>
                </div>

              </div>
            </div>
          </div>
          {/* <div className='container guide-container-plan'>
              <h3 className='guide-one-header'>Plan</h3>
            </div> */}

        </div >
      )
      }

      <Footer />
    </>
  )

}