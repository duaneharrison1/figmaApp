// src/components/CustomRoute.js
import React from 'react';
import { useParams } from 'react-router-dom';

function CustomRoute() {
  const { routeName } = useParams();

  return <h2>{routeName} Page</h2>;
}

export default CustomRoute;
