import React from 'react';
import { useState, useEffect, useRef } from 'react';
import './LandingPage.css';
import i18n from '../../i18n';
import main_header_image from './../../assets/images/main-header-image-v2.png';
import stepOne from './../../assets/images/stepOne.png';
import guideOne from './../../assets/images/guide_one_image_v2.png';
import guideTwo from './../../assets/images/guide_two_imag_v2.png';
import guideThree from './../../assets/images/guide_three_image_v2.png';
import one from './../../assets/images/one.png';
import two from './../../assets/images/two.png';
import three from './../../assets/images/three.png';
import Cross from '../../assets/images/crosswhite.png';
import WhiteCross from '../../assets/images/crosswhite.png';
import Check from '../../assets/images/check.png';
import WhiteCheck from '../../assets/images/white-check.png';
import CustomFaviconImage from '../../assets/images/custom_favicon_landing.png';
import CustomDomainImage from '../../assets/images/landing_custom_domain.png';
import PublishAsResponsiveImage from '../../assets/images/publish_as_responsive_landing.png';
import PasswordProtectionImage from '../../assets/images/password_protection_landing.png';
import MultipleProjectImage from '../../assets/images/multiple_project_landing.png';
import BasicImage from '../../assets/images/basic-img@2x.png';
import ProImage from '../../assets/images/pro-img@2x.png';
import freeImage from '../../assets/images/free-img@2x.png';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import ButtonColored from '../../components/ButtonColored/ButtonColored';
import ButtonStartForFree from '../../components/ButtonStartForFree/ButtonStrartForFree';
import ButtonGuide from '../../components/ButtonGuide/ButtonGuide';
import { useTranslation } from 'react-i18next';
import Footer from '../../components/Footer/Footer';


const LandingPage = () => {
  const { t } = useTranslation();
  const divGuide = useRef(null);
  const navigate = useNavigate();
  const [userId] = useAuthState(auth);
  const [user, setUser] = useState(null);
  const [priceTier, setPriceTier] = useState({
    amount: "$58",
    amountMonthly: "$6",
    description: "Billed as one payment of $58 USD",

  });



  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = "https://firebasestorage.googleapis.com/v0/b/figmawebapp.appspot.com/o/figmafolio-favicon.png?alt=media&token=3b9cc2d9-01c6-470e-910a-a64c168ed870?v=2";
  }, []);


  const scrollToDiv = () => {
    divGuide.current.scrollIntoView({ behavior: 'smooth' });
  };


  const navigateToHome = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };


  const currentLanguage = i18n.language;

  const goToDashboard = () => {
    const newPath = `/${currentLanguage}/dashboard`;
    navigate(newPath);
  };


  const goToAuthPage = () => {
    const newPath = `/${currentLanguage}/auth`;
    navigate(newPath);
  };


  const getUserLocationAndSetPrice = async () => {
                      try {
                          const res = await fetch('https://ipinfo.io?token=b259d22dc84b2e');  // Replace with your API token
                          const data = await res.json();
                          const userCountry = data.country;
              
                          /**
                           * REACT_APP_MONTHLY_FIVE=price_1ONTZXJyvkMmBNuRWbYtaMwL
                              REACT_APP_MONTHLY_FOUR=price_1QmvdcJyvkMmBNuRZOGrSpsA
                              REACT_APP_MONTHLY_THREE=price_1QmvfaJyvkMmBNuRElK3XZi5
                              REACT_APP_MONTHLY_TWO=price_1QmvhMJyvkMmBNuRYc1fOenx
              
                              REACT_APP_YEARLY_FIVE=price_1ONTZvJyvkMmBNuRn0a8XUNq
                              REACT_APP_YEARLY_FOUR=price_1QmvecJyvkMmBNuRKYHIvIGc
                              REACT_APP_YEARLY_THREE=price_1QmvgMJyvkMmBNuR1BQgIkJO
                              REACT_APP_YEARLY_TWO=price_1QmviAJyvkMmBNuRVyuTidKP
                           */
                              
                              console.log('Country:', userCountry);
              
              
                          const countryGroups = {
                              "highestPricedCountries":["US"],
                              "highPricedCountries":["IE", "GB", "FR", "JP", "KR", "IL", "IT"],
                              "mediumPricedCountries": ["TW", "ES", "PT", "PL"],
                              "lowPricedCountries":["MY", "CN", "AR", "BR"],
                              "lowestPricedCountries":["TH", "VN", "ID", "PH", "IN", "NG"]  
                          }
  
                          const pricingTiers = {
                            highest: { amount: "$58", amountMonthly: "$6", description: "Billed as one payment of $58 USD", descriptionMonthly:"Billed monthly at $6 USD" },
                            high: { amount: "$49", amountMonthly: "$5", description: "Billed as one payment of $49 USD", descriptionMonthly:"Billed monthly at $5 USD" },
                            medium: { amount: "$39", amountMonthly: "$4", description: "Billed as one payment of $39 USD", descriptionMonthly:"Billed monthly at $4 USD" },
                            low: { amount: "$29", amountMonthly: "$3", description: "Billed as one payment of $29 USD", descriptionMonthly:"Billed monthly at $3 USD" },
                            lowest: { amount: "$19", amountMonthly: "$2", description: "Billed as one payment of $19 USD", descriptionMonthly:"Billed monthly at $2 USD" },
                          };
                          
  
              
                          
                            if (countryGroups.highestPricedCountries.includes(userCountry)) {
                                setPriceTier(pricingTiers.highest);
                            } else if (countryGroups.highPricedCountries.includes(userCountry)) {
                                setPriceTier(pricingTiers.high);
                            } else if (countryGroups.mediumPricedCountries.includes(userCountry)) {
                                setPriceTier(pricingTiers.medium);
                            } else if (countryGroups.lowPricedCountries.includes(userCountry)) {
                                setPriceTier(pricingTiers.low);
                            } else if (countryGroups.lowestPricedCountries.includes(userCountry)) {
                                setPriceTier(pricingTiers.lowest);
                            } else {
                                setPriceTier(pricingTiers.highest); // Default to highest if country not found
                            }
                  
                          
                      } catch (error) {
                          console.error('Error fetching location:', error);
                      }
                  };
                  useEffect(() => {
                          getUserLocationAndSetPrice(); // Fetch location and set price IDs on component mount
                      }, []);


  return (
    <div className="landing-page">
      <div className="container-fluid main-landing-page p-0">
        {/* Navbar */}
        <div className="navbar-container">
          <div className="row">
            <div className="col-lg-8 col-4">
              <h4 className="logo" onClick={navigateToHome}>
                HTML<span className="green-text">Host</span>
              </h4>
            </div>
            <div className="col-lg-4 d-flex justify-content-end col-8">
              {user ? (
                <div className="landing-button-container">
                  <ButtonColored
                    onClick={goToDashboard}
                    className="btn-go-to-app"
                    label={t('go-to-app')}
                  />
                </div>
              ) : (
                <div className="landing-button-container">
                  <Link
                    to={`/${currentLanguage}/auth`}
                    className="login-link"
                    state={{ name: "tab1" }}
                  >
                    {t('login')}
                  </Link>
                  <ButtonColored
                    onClick={goToAuthPage}
                    className="btn-go-to-app"
                    label={t('signup')}
                  />
                </div>
              )}
            </div>
          </div>
        </div>


        {/* Main Content */}
        <div className="page-content-container">
          <div className="row">
            <div className="col-md-6 landing-page-container">
              <h1 className="landing-header">{t('landing-header')}</h1>
              <p className="landing-sec-subheader">{t('landing-subheader')}</p>
              <div className="btn_column">
                <ButtonStartForFree
                  onClick={goToAuthPage}
                  className="start-for-free-btn"
                  label={t('start-for-free')}
                />
                <ButtonGuide
                  onClick={scrollToDiv}
                  className="guide-btn"
                  label={t('guide')}
                />
              </div>
            </div>
            <div className="col-md-6 landing-page-container">
              <img className="landing-page-img" src={main_header_image} alt="Main Header" />
            </div>
          </div>
        </div>


        {/* Features Section */}
        <div className="landing-page-guide-container">
          <div className="make-it-yours-container">
            <h1 className="make-it-yours">Make it yours</h1>
            <h2 className="make-it-yours-subheader">
              Customize and publish your Figmafolio page
            </h2>
          </div>


          {/* Custom Domain Feature */}
          <div className="custom-domain-container">
            <div className="row">
              <div className="col-md-6">
                <div className="custom-domain-text-container">
                  <div>
                  <h3 className="landing-feature-header">Custom Domain</h3>
                  <p className="landing-feature-subheader">
                    Connect an existing custom domain to make your site truly yours.
                    We provide guidance and support
                  </p>

                  </div>
                  
                </div>
              </div>
              <div className="col-md-6">
                <div className="custom-domain-image-container">
                  <img src={CustomDomainImage} alt="Custom Domain" />
                </div>
              </div>
            </div>
          </div>


          {/* Feature Grid */}
          <div className="row first-row-feature-container">
            <div className="col-md-6">
              <div className="publish-as-responsive-container">
                <img
                  src={PublishAsResponsiveImage}
                  alt="Responsive Design"
                  className="landing-feature-image"
                />
                <h3 className="landing-feature-header">
                  Publish as Responsive Design
                </h3>
                <p className="landing-feature-subheader">
                  With Figma's new responsive prototype capability,
                  your designs will adapt to different screen sizes.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="publish-as-responsive-container">
                <img
                  src={CustomFaviconImage}
                  alt="Custom Favicon"
                  className="landing-feature-image"
                />
                <h3 className="landing-feature-header">Custom Favicon</h3>
                <p className="landing-feature-subheader">
                  Brand your site with a unique favicon that
                  appears in browser tabs and bookmarks.
                </p>
              </div>
            </div>
          </div>


          {/* Additional Features */}
          <div className="row first-row-feature-container">
            <div className="col-md-6">
              <div className="publish-as-responsive-container">
                <img
                  src={PasswordProtectionImage}
                  alt="Password Protection"
                  className="landing-feature-image"
                />
                <h3 className="landing-feature-header">Password Protection</h3>
                <p className="landing-feature-subheader">
                  Secure your confidential work or NDA projects with password protection.
                </p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="publish-as-responsive-container">
                <img
                  src={MultipleProjectImage}
                  alt="Multiple Projects"
                  className="landing-feature-image"
                />
                <h3 className="landing-feature-header">Project Showcase</h3>
                <p className="landing-feature-subheader">
                  Every project gets a unique URL, allowing you to share with clients
                  without changing links.
                </p>
              </div>
            </div>
          </div>


          {/* How It Works Section */}
          <div className="make-it-yours-container">
            <h1 className="make-it-yours">How it works</h1>
            <h2 className="make-it-yours-subheader">
              From Figma to live website in 3 simple steps
            </h2>
          </div>
          {/* Guide Steps */}
          <div className="row guide-container-version-two">
            <div className="col-md-6 landing-page-container col-md-push-6 order-2">
              <img src={guideOne} alt="Step 1" className="step-one-img" />
            </div>
            <div className="col-md-6 landing-page-container col-md-pull-6 order-1">
              <div className="guide-content" ref={divGuide}>
                <div className="guide-number">
                  <img src={one} alt="Number 1" className="step-one" />
                </div>
                <h2 className="guide-one-header">Design in Figma</h2>
                <h3 className="guide-one-subheader">
                  Skip learning other tools or coding. Bring your entire website or portfolio to life
                  right in Figma. Leverage its features like transitions, GIFs and video to make it
                  interactive and engaging.
                </h3>
              </div>
            </div>
          </div>


          <div className="row guide-container-version-two">
            <div className="col-md-6 landing-page-container col-md-push-6">
              <div className="guide-content">
                <div className="guide-number">
                  <img src={two} alt="Number 2" className="step-one" />
                </div>
                <h2 className="guide-one-header">Simple Setup</h2>
                <h3 className="guide-one-subheader">
                  Set up and preview your Figma prototype in our web interface.
                  Just paste the prototype URL and customize settings. Preview the
                  result before going live.
                </h3>
              </div>
            </div>
            <div className="col-md-6 landing-page-container">
              <img src={guideTwo} alt="Step 2" className="step-one-img" />
            </div>
          </div>


          <div className="row guide-container-version-two">
            <div className="col-md-6 landing-page-container col-md-push-6 order-2">
              <img src={guideThree} alt="Step 3" className="step-one-img" />
            </div>
            <div className="col-md-6 landing-page-container order-1">
              <div className="guide-content">
                <div className="guide-number">
                  <img src={three} alt="Number 3" className="step-one" />
                </div>
                <h2 className="guide-one-header">Go Live!</h2>
                <h3 className="guide-one-subheader">
                  Publish your site instantly to each viewing page and share it with
                  clients. You can use your personalized domain name.
                </h3>
              </div>
            </div>
          </div>


          {/* Pricing Section */}
          <div className="tier-container">
            <h1 className="tier-header">Pick a plan to suit your needs</h1>
            <h2 className="tier-subheader">
              Our transparent pricing makes it easy to find a plan that works
              within your financial constraints
            </h2>
          </div>


          <div className="landing-page-tier-div">
            {/* Free Tier */}
            <div className="landing-page-tier">
              <div className="landing-page-tier-content">
                <img className="plan-icon" src={freeImage} alt="Free Plan" />
                <h1 className="landing-page-payment-selection-title">Free</h1>
                <div className="amount-per-month">
                  <span className="landing-page-amount">$0</span>
                  <span className="landing-page-month">/month</span>
                </div>
                <p className="landing-page-bill-desc">No bills!</p>
                <div className="landing-payment-feature-container">
                  <div className="payment-feature">
                    <img className="check-icon" src={Check} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      1 project/website
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={Check} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      Free Figmafolio domain
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={Cross} alt="Cross" />
                    <p className="landing-page-payment-feature-text">
                      Removes 'Made with Figmafolio' label
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={Cross} alt="Cross" />
                    <p className="landing-page-payment-feature-text">
                      Customize Favicon
                    </p>
                  </div>
                </div>
                <div className="landing-page-button-upgrade-container">
                  <Link to="/auth" state={{ name: "tab2" }}>
                    <ButtonColored className="btn-get-started" label="Try for free" />
                  </Link>
                </div>
              </div>
            </div>


            {/* Basic Tier */}
            <div className="landing-page-tier">
              <div className="landing-page-tier-content">
                <img className="plan-icon" src={BasicImage} alt="Basic Plan" />
                <h1 className="landing-page-payment-selection-title">Basic</h1>
                <div className="amount-per-month">
                  <span className="landing-page-amount">{priceTier.amountMonthly}</span>
                  <span className="landing-page-month">/month</span>
                </div>
                <p className="landing-page-bill-desc">{priceTier.descriptionMonthly}</p>
                <div className="landing-payment-feature-container">
                  <div className="payment-feature">
                    <img className="check-icon" src={Check} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      5 projects/websites
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={Check} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      Connect your existing custom domains
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={Check} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      Removes 'Made with Figmafolio' label
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={Check} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      Password protection
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={Check} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      Customize Favicon
                    </p>
                  </div>
                </div>
                <div className="landing-page-button-upgrade-container">
                  <Link to="/auth" state={{ name: "tab2" }}>
                    <ButtonColored className="btn-get-started" label="Get started" />
                  </Link>
                </div>
              </div>
            </div>


            {/* Pro Tier */}
            <div className="landing-page-tier pro">
              <div className="landing-page-tier-content">
                <img className="plan-icon" src={ProImage} alt="Pro Plan" />
                <h1 className="landing-page-payment-selection-title">Pro</h1>
                <div className="amount-per-month">
                  <span className="landing-page-amount">{priceTier.amount}</span>
                  <span className="landing-page-month">/year</span>
                </div>
                <p className="landing-page-bill-desc">{priceTier.description}</p>
                <div className="landing-payment-feature-container">
                  <div className="payment-feature">
                    <img className="check-icon" src={WhiteCheck} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      Unlimited projects/websites
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={WhiteCheck} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      Connect your existing custom domains
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={WhiteCheck} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      Removes 'Made with Figmafolio' label
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={WhiteCheck} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      Password protection
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={WhiteCheck} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      Customize Favicon
                    </p>
                  </div>
                  <div className="payment-feature">
                    <img className="check-icon" src={WhiteCheck} alt="Check" />
                    <p className="landing-page-payment-feature-text">
                      Priority technical and product support
                    </p>
                  </div>
                </div>
                <div className="landing-page-button-upgrade-container">
                  <Link to="/auth" state={{ name: "tab2" }}>
                    <ButtonColored className="btn-get-started" label="Get started" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};


export default LandingPage;
