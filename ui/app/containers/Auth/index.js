/**
 *
 * Auth
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import SignUp from 'containers/SignUp/Loadable';
import ActiveUser from 'containers/ActiveUser/Loadable';
import LoginPage from 'containers/LoginPage/Loadable';
import ForgotPassword from 'containers/ForgotPassword/Loadable';
import PasswordReissue from 'containers/PasswordReissue/Loadable';
import { Switch, Route } from 'react-router-dom';
import MapsPage from 'containers/MapsPage';
import { urlLink } from '../../helper/route';
import makeSelectAuth from './selectors';
import reducer from './reducer';
import saga from './saga';
import './style.scss';

export function Auth() {
  useInjectReducer({ key: 'auth', reducer });
  useInjectSaga({ key: 'auth', saga });

  return (
    <div className="auth-wrapper">
      <div className="auth-left">
        <MapsPage />
      </div>
      <div className="auth-right">
        <Switch>
          <Route path={urlLink.auth.sign_in} component={LoginPage} />
          <Route path={urlLink.auth.sign_up} component={SignUp} />
          <Route path={urlLink.auth.active_user} component={ActiveUser} />
          <Route
            path={urlLink.auth.forgot_password}
            component={ForgotPassword}
          />
          <Route
            path={urlLink.auth.password_reissue}
            component={PasswordReissue}
          />
          <Route path="/" component={LoginPage} />
        </Switch>
      </div>
    </div>
  );
}

Auth.propTypes = {};

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Auth);
