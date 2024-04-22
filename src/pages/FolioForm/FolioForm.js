import React, {useState } from 'react';
import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/NavBar/Navbar';
import {auth } from '../../firebase';
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from 'react-router-dom';
import { t } from 'i18next';
import i18n from '../../i18n';
import './FolioForm.css'
import FormTitle from '../../components/FormTitle/FormTitle';
import FormInstruction from '../../components/FormInstruction/FormInstruction';
import FormContent from '../../components/FormContent/FormContent';
import FormCustomDomain from '../../components/FormCustomDomain/FormCustomDomain';
import FormFavicon from '../../components/FormFavicon/FormFavicon';

export default function FolioForm() {
    const currentLanguage = i18n.language;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('tab1');

    // Function to handle tab click
    const handleTabClick = (tabId) => {
      setActiveTab(tabId);
    };
    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate(currentLanguage + "/");
        }).catch((error) => {

        });
    }
    const user = auth.currentUser;
   
    return (

        <>
            {/* <Navbar className={"dashboardNavBar"} email={user.email} onClickLogout={handleLogout}  /> */}

           
            <div className="folioform">
      <div className="row">
        <div className="col-md-3">
          <ul className="nav flex-column nav-tabs vertical-tabs">
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'tab1' ? 'active' : ''}`}
                onClick={() => handleTabClick('tab1')}
                href="#tab1"
        >
                General
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'tab2' ? 'active' : ''}`}
                onClick={() => handleTabClick('tab2')}
                href="#tab2"
              >
               Content
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'tab3' ? 'active' : ''}`}
                onClick={() => handleTabClick('tab3')}
                href="#tab3"
              >
                Custom Domain
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'tab4' ? 'active' : ''}`}
                onClick={() => handleTabClick('tab4')}
                href="#tab3"
              >
                Favicon
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${activeTab === 'tab5' ? 'active' : ''}`}
                onClick={() => handleTabClick('tab5')}
                href="#tab3"
              >
                Need help?
              </a>
            </li>
          </ul>
        </div>
        <div className="col-md-9 folio-form-tab-content">
          <div className="tab-content">
            <div className={`tab-pane fade ${activeTab === 'tab1' ? 'show active' : ''}`} id="tab1">
             <FormTitle/>
            </div>
            <div className={`tab-pane fade ${activeTab === 'tab2' ? 'show active' : ''}`} id="tab2">
             <FormContent/>
            </div>
            <div className={`tab-pane fade ${activeTab === 'tab3' ? 'show active' : ''}`} id="tab3">
              <FormCustomDomain/>
            </div>
            <div className={`tab-pane fade ${activeTab === 'tab4' ? 'show active' : ''}`} id="tab4">
            <FormFavicon/>
            </div>
            <div className={`tab-pane fade ${activeTab === 'tab5' ? 'show active' : ''}`} id="tab5">
           <FormInstruction/>
            </div>

          </div>
        </div>
      </div>
    </div>

        <Footer/>
        </>

    );
};

