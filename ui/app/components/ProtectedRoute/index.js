/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
// components/ProtectedRoute.js
// eslint-disable-next-line prettier/prettier
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import localStorage from 'local-storage';
import { Route, Redirect } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';

import { useInjectReducer } from '../../utils/injectReducer';
import appReducer from '../../containers/App/reducer';
import { useInjectSaga } from '../../utils/injectSaga';
import appSaga from '../../containers/App/saga';
import makeSelectApp from '../../containers/App/selectors';
import { getLogout, validateToken } from '../../containers/App/actions';
import { urlLink } from '../../helper/route';

const ProtectedRoute = ({ component: Component, path, app, ...rest }) => {
  useInjectReducer({ key: 'app', reducer: appReducer });
  useInjectSaga({ key: 'app', saga: appSaga });

  const { isValidToken = false, currentUser = {} } = app;
  const token = localStorage.get('token');

  useEffect(() => {
    if (!_.isEmpty(currentUser) && token) {
      rest.validateToken({ userId: currentUser._id, token });
    }
  }, [Component]);

  useEffect(() => {
    if (!isValidToken && token && currentUser) {
      rest.logout();
    }
  }, [isValidToken]);

  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        if (isValidToken) {
          return <Component {...props} />;
        }
        return <Redirect to={urlLink.auth.sign_in} />;
      }}
    />
  );
};

ProtectedRoute.propTypes = {
  app: PropTypes.object.isRequired,
  component: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
});

function mapDispatchToProps(dispatch) {
  return {
    validateToken: ({ userId, token }) =>
      dispatch(validateToken({ userId, token })),
    logout: () => dispatch(getLogout()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ProtectedRoute);
