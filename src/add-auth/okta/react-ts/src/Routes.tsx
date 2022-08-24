import React from 'react';

import { Route, Routes } from 'react-router-dom';
import { LoginCallback } from '@okta/okta-react';
import Home from './Home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/callback" element={<LoginCallback/>}/>
    </Routes>
  );
};

export default AppRoutes;
