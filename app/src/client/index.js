import React from 'react';
import ReactDOM from 'react-dom';
import axe from 'react-axe';

import App from './components/Application/App';
import * as serviceWorker from '../../serviceWorker';

// Disable AXE for production
if (process.env.NODE_ENV !== 'production') {
  axe(React, ReactDOM, 1000);
}

ReactDOM.render(<App evolutionStep={50} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
