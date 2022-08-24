import React from 'react';

import './App.css';
import logo from './logo.svg';
import { useOktaAuth } from '@okta/okta-react';

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();

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
          Edit <code>src/Home.tsx</code> and save to reload.
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
