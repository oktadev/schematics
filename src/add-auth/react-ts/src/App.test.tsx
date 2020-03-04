import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import App from './App';

let container: any;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

test('renders learn react link', async () => {
  await act(async () => {
    ReactDOM.render(<App/>, container);
  });

  const linkElement = container.querySelector('a');
  expect(linkElement.textContent).toBe('Learn React');
});
