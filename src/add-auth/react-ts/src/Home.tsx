import React, { Component } from 'react';
import { AuthState, OktaAuth } from '@okta/okta-auth-js';
import { withOktaAuth } from '@okta/okta-react';
import './App.css';
import logo from './logo.svg';

interface HomeProps {
  oktaAuth: OktaAuth;
  authState: AuthState;
  _onAuthRequired: any;
}

interface HomeState {
}

export default withOktaAuth(class Home extends Component<HomeProps, HomeState> {
  constructor(props: HomeProps) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async login() {
    await this.props.oktaAuth.signInWithRedirect();
  }

  async logout() {
    await this.props.oktaAuth.signOut();
  }

  render() {
    let body = null;
    if (this.props.authState.isAuthenticated) {
      body = (
        <div className="Buttons">
          <button onClick={this.logout}>Logout</button>
          {/* Replace me with your root component. */}
        </div>
      );
    } else {
      body = (
        <div className="Buttons">
          <button onClick={this.login}>Login</button>
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
  }
});
