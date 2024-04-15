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
import Cross from '../../assets/images/crosswhite.png';
import WhiteCross from '../../assets/images/crosswhite.png';
import WhiteCheck from '../../assets/images/white-check.png';
import stepThree from './../../assets/images/stepThree.png';
import Footer from '../../components/Footer/Footer';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import ButtonClear from '../../components/ButtonClear/ButtonClear';
import ButtonStartForFree from '../../components/ButtonStartForFree/ButtonStrartForFree';
import ButtonGuide from '../../components/ButtonGuide/ButtonGuide';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';
export default function LandingPage() {
  const { t } = useTranslation();
  const divGuide = useRef(null);
  const navigate = useNavigate();
  const [userId] = useAuthState(auth);
  const [user, setUser] = useState(null);
  const lng = navigator.language;
  // const [columnHeights, setColumnHeights] = useState([300, 300, 400]);

  // const updateColumnHeights = () => {
  //   const columnElements = document.querySelectorAll('.col-lg-4'); // Select all columns
  //   const newHeights = Array.from(columnElements).map(col => col.scrollHeight); // Get heights
  //   setColumnHeights(newHeights); // Update state with new heights
  // };


  useEffect(() => {

    i18n.changeLanguage(lng);
  }, [])
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
  const navigateToHome = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };
  return (
    <>
      < div className='container-fluid main-landing-page'>
        <div className='navbar-container'>
          <div className="row">
            <div className="col-sm-8 col-4">
              <h4 className='figmalio-logged' onClick={navigateToHome}> Figmafolio</h4 >
            </div >
            <div className="col-sm-4 d-flex justify-content-end col-8">
              {user ?
                <div className="button-container">
                  <Link to="/dashboard" >
                    <ButtonColored className="gotoapp" label={t('go-to-app')} />
                  </Link>
                </div>
                :
                <div className="button-container">
                  <Link to="/auth" className='login-link' state={{ "name": "tab1" }}>{t('login')}</Link>
                  <Link to="/auth" state={{ "name": "tab2" }} >
                    <ButtonColored className="signup-btn" label={t('signup')} />
                  </Link>
                </div>
              }
            </div >
          </div >
        </div >

        <div className='page-content-container'>
          <div className='row'>
            <div className='col-md-6 col-md-push-6'>
              <h1 className='landing-header'>{t('landing-header')}</h1>
              <h1 className='landing-sec-subheader'>{t('landing-subheader')}</h1>

              <div className='row btn_column  '>
                <div className='col-md-10 m-0 p-0'>
                  <Link to="/auth" state={{ "name": "tab2" }} >
                    <ButtonStartForFree className="start-for-free-btn-second" label={t('start-for-free')} />
                  </Link>
                  <ButtonGuide onClick={scrollToDiv} className="guide-btn" label={t('guide')} />
                </div>
              </div>

            </div>
            <div className='col-md-6 col-md-push-6'>
              <img className="landing-page-img" src={main_header_image} />
            </div>
          </div>
        </div>

        <div className='landing-page-guide-container'>

          <div className='row guide-container-version-two'>
            <div className='col-md-6 col-md-push-6 order-2'>
              <img src={guideOne} className='step-one-img' />
            </div>
            <div className='col-md-6 col-md-pull-6 order-1 guide-details' ref={divGuide}>
              <div className='row'>
                <div className='col-2 guide-number '>
                  <img src={one} className='step-one' />
                </div>
                <div className='col-10'>
                  <h2 className='guide-one-header'> {t('design-in-figma')}</h2>
                  <h3 className='guide-one-subheader'>{t('instruc-one')}</h3>
                </div>
              </div>

            </div>
          </div>
          <div className='row guide-container-version-two'>
            <div className='col-md-6 col-md-push-6 guide-details'>
              <div className='row'>
                <div className='col-2 guide-number'>
                  <img src={two} className='step-one' />
                </div>
                <div className='col-10'>
                  <h2 className='guide-one-header'>{t('simple-setup')}</h2>
                  <h3 className='guide-one-subheader'>{t('instruc-two')}</h3>
                </div>
              </div>

            </div>
            <div className='col-md-6 col-md-push-6'>
              <img src={guideTwo} className='step-one-img' />
            </div>
          </div>

          <div className='row '>
            <div className='col-md-6 col-md-push-6 order-2'>
              <img src={guideThree} className='step-one-img' />
            </div>
            <div className='col-md-6 col-md-push-6 order-1 guide-details'>
              <div className='row'>
                <div className='col-2 guide-number'>
                  <img src={three} className='step-one' />
                </div>
                <div className='col-10'>
                  <h2 className='guide-one-header'>{t('go-live')}</h2>
                  <h3 className='guide-one-subheader'>{t('instruc-three')}</h3>
                </div>
              </div>

            </div>
          </div>
          <h1 className='tier-header'>{t('pick-a-plan')} </h1>



          <div className='flex landing-page-tier-div'>

            <div className='landing-page-tier' >
              <div className='landing-page-tier-content'>
                <h1 className='landing-page-payment-selection-title'>{t('free')}</h1>
                <div className='amount-per-month'>
                  <span className='landing-page-amount'>$0 </span>
                  <span className='landing-page-month'>/month</span>
                </div>
                <h4 className='landing-page-bill-desc'>{t('no-bills')}</h4>
                <div className='landing-payment-feature-container'>
                  <div className="payment-feature">
                    <img className='check-icon' src={WhiteCheck} />
                    <h4 className='landing-page-payment-feature-text'>{t('free-feat-one')}</h4>
                  </div>
                  <div className="payment-feature">
                    <img className='check-icon' src={WhiteCheck} />
                    <h4 className='landing-page-payment-feature-text'> {t('free-feat-two')}</h4>
                  </div>
                  <div className="payment-feature">
                    <img className='check-icon' src={Cross} />
                    <h4 className='landing-page-payment-feature-text'>{t('removes-made-with')}</h4>
                  </div>
                </div>
              </div>

              <div className='landing-page-button-upgrade-container'>
                <Link to="/auth" state={{ "name": "tab2" }} >
                  <ButtonColored className="btn-get-started" label={t('try-for-free')} />
                </Link>
              </div>
            </div>

            <div className='landing-page-tier' >
              <div className='landing-page-tier-content'>
                <h1 className='landing-page-payment-selection-title'> {t('monthly')}</h1>

                <div className='amount-per-month'>
                  <span className='landing-page-amount'>$5 </span>
                  <span className='landing-page-month'>/month</span>
                </div>
                <h4 className='landing-page-bill-desc'> {t('billed-monthly-at')} </h4>
                <div className='landing-payment-feature-container'>
                  <div className="payment-feature">
                    <img className='check-icon' src={WhiteCheck} />
                    <h4 className='landing-page-payment-feature-text'>{t('monthly-feat-one')}</h4>
                  </div>
                  <div className="payment-feature">
                    <img className='check-icon' src={WhiteCheck} />
                    <h4 className='landing-page-payment-feature-text'> {t('monthly-yearly-feat-two')}</h4>
                  </div>
                  <div className="payment-feature">
                    <img className='check-icon' src={WhiteCheck} />
                    <h4 className='landing-page-payment-feature-text'>{t('removes-made-with')}</h4>
                  </div>
                </div>

              </div>

              <div className='landing-page-button-upgrade-container'>
                <Link to="/auth" state={{ "name": "tab2" }} >
                  <ButtonColored className="btn-get-started" label={t('get-started')} />
                </Link>
              </div>
            </div>



            <div className='landing-page-tier' >
              <div className='landing-page-tier-content'>
                <div className="heading-container">
                  <h1 className='landing-page-payment-selection-title'> {t('yearly')}</h1>

                </div>

                <div className='amount-per-month'>

                  <span className='landing-page-amount'>$4 </span>
                  <span className='landing-page-month'>/month</span>
                </div>
                <h4 className='landing-page-bill-desc'>{t('billed-yearly-at')}</h4>

                <div className='landing-payment-feature-container'>
                  <div className="payment-feature">
                    <img className='check-icon' src={WhiteCheck} />
                    <h4 className='landing-page-payment-feature-text'>{t('yearly-feat-one')}</h4>
                  </div>
                  <div className="payment-feature">
                    <img className='check-icon' src={WhiteCheck} />
                    <h4 className='landing-page-payment-feature-text'>{t('monthly-yearly-feat-two')}</h4>
                  </div>
                  <div className="payment-feature">
                    <img className='check-icon' src={WhiteCheck} />
                    <h4 className='landing-page-payment-feature-text'>{t('removes-made-with')}</h4>
                  </div>
                  <div className="payment-feature">
                    <img className='check-icon' src={WhiteCheck} />
                    <h4 className='landing-page-payment-feature-text'>{t('monthly-yearly-feat-three')}</h4>
                  </div>
                </div>
              </div>
              <div className='landing-page-button-upgrade-container'>
                <Link to="/auth" state={{ "name": "tab2" }} >
                  <ButtonColored className="btn-get-started" label={t('get-started')} />
                </Link>
              </div>

            </div>


          </div>
        </div>
        <Footer />
      </div >

    </>
  )

}