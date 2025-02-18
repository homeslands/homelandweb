/* eslint-disable indent */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import ClassNames from 'classnames';
import { NavLink, useLocation } from 'react-router-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './style.scss';
import { FormattedMessage } from 'react-intl';
import { Close } from '@material-ui/icons';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import img2 from './en.png';
import img1 from './vi.png';
import messages from './messages';
import { getNotification } from '../../containers/Notification/actions';
import { urlLink } from '../../helper/route';
import { FilterModal } from './Modal/index';
import { NavigationDropdown } from './Dropdown/NavigationDropdown';
import InputLocation from '../InputLocation';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import notificationReducer from '../../containers/Notification/reducer';
import notificationSaga from '../../containers/Notification/saga';
import mapReducer from '../../containers/MapsPage/reducer';
import mapSaga from '../../containers/MapsPage/saga';
import makeSelectNotification from '../../containers/Notification/selectors';
import { NotificationDropdown } from './Dropdown';
import { searchAddress } from '../../containers/MapsPage/actions';

const Navbar = props => {
  useInjectReducer({ key: 'notificationPage', reducer: notificationReducer });
  useInjectSaga({ key: 'notificationPage', saga: notificationSaga });
  useInjectReducer({ key: 'mapPage', reducer: mapReducer });
  useInjectSaga({ key: 'mapPage', saga: mapSaga });

  const { currentUser = {}, notificationState = {} } = props;
  const [toggle, setToggle] = useState(false);
  const location = useLocation();
  const { pathname } = location;
  const [address, setAddress] = useState('Ho Chi Minh');

  useEffect(() => {
    if (!_.isEmpty(currentUser)) props.getNotificationById(currentUser._id);
  }, [currentUser, urlLink]);

  const handleClose = () => {
    setToggle(false);
  };

  return (
    <div className="navbar-wrapper">
      <div className="header-content clearfix">
        <div className="navbar">
          {/* Left content */}
          <div className="navbar__left">
            {/* Logo */}
            <div className="navbar__logo">
              <NavLink exact to="/">
                <div className="logo-text">
                  <img
                    className="logo zoom-hover"
                    src="/favicon.png"
                    alt="logo"
                  />{' '}
                  <FormattedMessage {...messages.home} />
                </div>
              </NavLink>
            </div>
            {/* Select language */}
            <div className="navbar__language">
              <div
                className="language-vi navbar__language-item"
                onClick={() => {
                  props.changeLocale('vi');
                }}
              >
                <img src={img1} alt="language" />
              </div>
              <div
                className="language-en navbar__language-item"
                onClick={() => {
                  props.changeLocale('en');
                }}
              >
                <img src={img2} alt="language" />
              </div>
            </div>
          </div>
          {/* Center block */}
          <div className="navbar__center">
            {/* Search */}
            <div className="navbar__center-search">
              <FormattedMessage {...messages.searchLocation}>
                {msg => (
                  <InputLocation
                    placeholder={msg}
                    name="address"
                    value={address}
                    onSelect={value => {
                      setAddress(value.formatted_address);
                      props.searchAddress(value.formatted_address);
                    }}
                    onChange={value => setAddress(value.formatted_address)}
                  />
                )}
              </FormattedMessage>
            </div>
            {/* Filter modal */}
            <FilterModal />
          </div>
          {/* Navigation block */}
          <div
            className={ClassNames(
              'navbar__right',
              'site-nav',
              { 'mobile-menu-hide': !toggle },
              { 'mobile-menu-show': toggle },
            )}
          >
            <ul className="site-main-menu">
              <div className="close-menu">
                <button
                  className="close-menu-btn"
                  onClick={handleClose}
                  type="button"
                >
                  <Close />
                </button>
              </div>
              <li>
                <NavLink
                  exact
                  to="/terms"
                  onClick={() => {
                    setToggle(false);
                  }}
                >
                  <FormattedMessage {...messages.contact} />
                </NavLink>
              </li>
              <li>
                <NavLink
                  exact
                  to="/about"
                  onClick={() => {
                    setToggle(false);
                  }}
                >
                  <FormattedMessage {...messages.about} />
                </NavLink>
              </li>
              {/* Notification */}
              <NotificationDropdown notificationState={notificationState} />
              {/* Navigation */}
              {!_.isEmpty(currentUser) ? (
                <NavigationDropdown changeStoreData={props.changeStoreData} />
              ) : (
                <li
                  className={pathname.includes('/auth/login') ? 'active' : ''}
                >
                  <NavLink
                    exact
                    to="/auth/login"
                    onClick={() => {
                      setToggle(false);
                    }}
                  >
                    <i className="fa fa-sign-in" aria-hidden="true" />{' '}
                    <FormattedMessage {...messages.signin_signup} />
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
          {/* End navigation */}
        </div>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  currentUser: PropTypes.object,
  notificationState: PropTypes.object.isRequired,
  changeStoreData: PropTypes.func,
  getNotification: PropTypes.func,
  getNotificationById: PropTypes.func,
  searchAddress: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  notificationState: makeSelectNotification(),
});

function mapDispatchToProps(dispatch) {
  return {
    getNotificationById: id => {
      dispatch(getNotification(id));
    },
    searchAddress: address => dispatch(searchAddress(address)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(Navbar);
