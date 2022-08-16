import React, { useState, useEffect } from 'react';

import './App.css';
import logo from './logo.svg';
import { useOktaAuth } from '@okta/okta-react';

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  // adding userInfo makes 'setUserInfo is not a function' go away
  // todo: fix me
  // eslint-disable-next-line
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, oktaAuth, setUserInfo]); // Update if authState changes

  const login = async () => oktaAuth.signInWithRedirect();
  const logout = async () => oktaAuth.signOut();

  if (!authState) {
    return (
      <div>Loading...</div>
    );
  }

  let body;
  if (authState.isAuthenticated) {
    body = (
      <div className="Buttons">
        <button onClick={logout}>Logout</button>
        {/* Replace me with your root component. */}
      </div>
    );
  } else {
    body = (
      <div className="Buttons">
        <button onClick={login}>Login</button>
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
