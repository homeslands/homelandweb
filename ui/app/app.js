/* eslint-disable import/first */
/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import '@babel/polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from 'utils/history';
import 'sanitize.css/sanitize.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-tooltip/dist/react-tooltip.css';
require('dotenv').config();

// Import root app
import App from 'containers/App';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./images/water.png';
import '!file-loader?name=[name].[ext]!./images/favicon.png';
import '!file-loader?name=[name].[ext]!./images/Kevin.png';
import '!file-loader?name=[name].[ext]!./images/Kevon.png';
import '!file-loader?name=[name].[ext]!./images/icon-maps.png';
import '!file-loader?name=[name].[ext]!./images/defaul-room.jpg';
import '!file-loader?name=[name].[ext]!./images/checked.png';
import '!file-loader?name=[name].[ext]!./images/background.jpg';
import '!file-loader?name=[name].[ext]!./images/electric.png';
import '!file-loader?name=[name].[ext]!./images/month.png';
import '!file-loader?name=[name].[ext]!./images/vi.png';
import '!file-loader?name=[name].[ext]!./images/en.png';

import '!file-loader?name=[name].[ext]!./images/air_conditioner.png';
import '!file-loader?name=[name].[ext]!./images/broom.png';
import '!file-loader?name=[name].[ext]!./images/delivery.png';
import '!file-loader?name=[name].[ext]!./images/dropceiling.png';
import '!file-loader?name=[name].[ext]!./images/gate.png';
import '!file-loader?name=[name].[ext]!./images/laundry.png';
import '!file-loader?name=[name].[ext]!./images/shower.png';
import '!file-loader?name=[name].[ext]!./images/stairs.png';
import '!file-loader?name=[name].[ext]!./images/television.png';
import '!file-loader?name=[name].[ext]!./images/time.png';
import '!file-loader?name=[name].[ext]!./images/toiletbowl.png';
import '!file-loader?name=[name].[ext]!./images/wardrobe.png';
import '!file-loader?name=[name].[ext]!./images/washstand.png';
import '!file-loader?name=[name].[ext]!./images/wifi.png';
import '!file-loader?name=[name].[ext]!./images/ic_profile_blue.png';
import '!file-loader?name=[name].[ext]!./images/ic_notification.png';
import '!file-loader?name=[name].[ext]!./images/icon_add.png';
import '!file-loader?name=[name].[ext]!./images/edit.png';
import '!file-loader?name=[name].[ext]!./images/trash.png';
import 'file-loader?name=.htaccess!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import configureStore from './configureStore';

// Import i18n messages
import { translationMessages } from './i18n';

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById('app');

const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </LanguageProvider>
    </Provider>,
    MOUNT_NODE,
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./i18n', 'containers/App'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
if (!window.Intl) {
  new Promise(resolve => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch(err => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
