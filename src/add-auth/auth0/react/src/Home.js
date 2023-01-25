import React from 'react';

import './App.css';
import logo from './logo.svg';
import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {
  const { isLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if (isLoading) {
    return (
      <div>Loading...</div>
    );
  }

  let body;
  if (isAuthenticated) {
    body = (
      <div className="Buttons">
        <button onClick={() => logout({
          logoutParams: { returnTo: window.location.origin, }
        })}>Logout</button>
        {/* Replace me with your root component. */}
      </div>
    );
  } else {
    body = (
      <div className="Buttons">
        <button onClick={loginWithRedirect}>Login</button>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/Home.js</code> and save to reload.
        </p>
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>
        {body}
      </header>
    </div>
  );
};

export default Home;
