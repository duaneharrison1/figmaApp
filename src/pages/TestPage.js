import React from 'react';

import { Helmet } from 'react-helmet';

function TestPage() {
  
  return (
<>
<Helmet>
    <title>hello world Test</title>
    <meta property="og:title" content="hello world Test" />
    <meta property="twitter:title"  content="hello world Test" />
    <meta property="og:description" content="A brief description of my page" />
    <meta property="twitter:description" content="A brief description of my page" />
  </Helmet>
  <h1> Hello world</h1>
</>
    
  );
}

export default TestPage;
