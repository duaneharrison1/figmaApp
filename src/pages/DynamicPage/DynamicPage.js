import React from 'react';
import { useState, useEffect } from 'react';
import './DynamicPage.css';
function DynamicPage({ url }) {

  document.title = url.title;
  const [isMobile, setIsMobile] = useState(false);
  const [mobile, setMobile] = useState("");
  const [desktop, setDesktop] = useState("");
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();

    if (url.urls.figmaMobileUrl == "") {
      setMobile(url.urls.figmaDesktopUrl)
    } else {
      setMobile(url.urls.figmaMobileUrl)
    }

    if (url.urls.figmaDesktopUrl == "") {
      setDesktop(url.urls.figmaMobileUrl)
    } else {
      setDesktop(url.urls.figmaDesktopUrl)
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);
  return (
    <>
      <div className="text-overlay">
        <p className='made-with'>Made with <span className="made-with-figmaolio">Figmafolio</span></p>
      </div>
      <iframe
        src={isMobile ? mobile : desktop}
        allowFullScreen
        referrerpolicy="no-referrer"
        style={{ width: '100%', height: '100vh' }}
        className='dynamic_view_figma_view'>
      </iframe>
    </>

  );
}

export default DynamicPage;


