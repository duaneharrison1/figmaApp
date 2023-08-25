import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from '../firebase';

function DynamicPage({ url }) {



  console.log("wew1" + url.figmaUrl);
  console.log("wew1" + url.customUrl);
  return (<>

    <iframe
      src={url.figmaUrl}
      allowFullScreen
      style={{ width: '100%', height: '100vh' }}
      className='figma_view'></iframe>
  </>
  );
}

export default DynamicPage;


