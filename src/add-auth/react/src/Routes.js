import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { LoginCallback } from '@okta/okta-react';
import Home from '../pages/Home';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" exact={true} element={<Home/>}/>
      <Route path="login/callback" element={<LoginCallback/>}/>
    </Routes>
  );
};

export default AppRoutes;
