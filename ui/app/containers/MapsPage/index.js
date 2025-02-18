/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/**
 *
 * MapsPage
 *
 */

import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { LocationOn, Phone } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import localStore from 'local-storage';
import { Row, Col } from 'reactstrap';
import _ from 'lodash';

import messages from './messages';
import { useInjectReducer } from '../../utils/injectReducer';
import { useInjectSaga } from '../../utils/injectSaga';
import GoogleMaps from '../../components/GoogleMaps';
import Money from '../App/format';
import { changeStoreData, getMotels, selectMotel } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectMapsPage from './selectors';
import './style.scss';
import { isHost } from '../../utils/auth';
import appReducer from '../App/reducer';
import appSaga from '../App/saga';

export function MapsPage(props) {
  const history = useHistory();
  useInjectReducer({ key: 'mapsPage', reducer });
  useInjectSaga({ key: 'mapsPage', saga });
  useInjectReducer({ key: 'app', reducer: appReducer });
  useInjectSaga({ key: 'app', saga: appSaga });

  const [windowHeight, setWindowHeight] = useState(0);
  const { motels = [], location, selectedMotel = {} } = props.mapsPage;
  const currentUser = localStore.get('user');
  document.documentElement.style.setProperty('--vh', `${windowHeight}px`);
  const valueFilter = useMemo(
    () => ({
      address: 'Viet Nam',
      minPrice: 0,
      maxPrice: 100000000,
      utilities: [
        'wifi',
        'bon_cau',
        'dieu_hoa',
        'truyen_hinh',
        'voi_hoa_sen',
        'giat_ui',
        'giu_xe',
        'gac_lung',
        'bon_rua_mat',
        'don_phong',
        'san_go',
        'tu_quan_ao',
        'gio_giac_tu_do',
        'loi_di_rieng',
      ],
    }),
    [],
  );

  useEffect(() => {
    props.getMotels('');
  }, []);

  const resizeWindow = () => {
    if (window.innerWidth < 576) {
      setWindowHeight(window.innerHeight * 0.01 - 57 * 0.01);
    } else {
      setWindowHeight(window.innerHeight * 0.01 - 100 * 0.01);
    }
  };

  useEffect(() => {
    resizeWindow();
    window.addEventListener('resize', resizeWindow);
    return () => window.removeEventListener('resize', resizeWindow);
  }, []);

  return (
    <div className="maps-page-wrapper">
      <Helmet>
        <title>MapsPage</title>
        <meta name="description" content="Description of MapsPage" />
      </Helmet>
      <GoogleMaps
        location={location}
        motels={motels}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCVwwlv1Q3FKlJUZTV-ab5hknaivIDv87o&v=3.exp&libraries=geometry,drawing,places"
        loadingElement={<div style={{ height: '100%' }} />}
        containerElement={<div style={{ height: '100%' }} />}
        mapElement={<div style={{ height: '100%' }} />}
        setMotel={props.selectMotel}
      />
      <div className="status-wrapper container">
        <div className="status">
          <div className="green-box" />
          Còn phòng
        </div>
        <div className="status">
          <div className="red-box" />
          Đã thuê
        </div>
        <div className="status">
          <div className="orange-box" />
          Sắp trống
        </div>
      </div>
      {/* {!_.isEmpty(selectedMotel) && (
        <div className="detail-wrapper">
          <div className="container">
            <Row>
              <Col xs={12} className="full-image">
                {selectedMotel.images ? (
                  <Col xs={12} className="image-container">
                    <Col xs={4} className="image">
                      <img
                        className="image"
                        src={selectedMotel.images}
                        alt="motel"
                      />
                    </Col>
                    <Col xs={8} className="card-content">
                      <div className="card-info">
                        <div className="title">{selectedMotel.name}</div>
                        <div className="address">
                          <LocationOn className="address-icon" />
                          {selectedMotel.address.address}
                        </div>
                        <div className="price">
                          {Money(selectedMotel.minPrice || 0)} -{' '}
                          {Money(selectedMotel.maxPrice || 0)} đ
                        </div>
                        <div className="phone">
                          <Phone className="phone-icon" />
                          {selectedMotel.contactPhone}
                        </div>
                      </div>
                      <div className="button-container">
                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() => props.selectMotel({})}
                        >
                          <FormattedMessage {...messages.Cancel} />
                        </button>
                        {isHost(currentUser) ? (
                          <button
                            type="button"
                            className="detail-button"
                            onClick={() => {
                              history.push(`/motel/${selectedMotel._id}`);
                            }}
                          >
                            <FormattedMessage {...messages.Detail} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="detail-button"
                            onClick={() => {
                              history.push(
                                `/motel-detail-v2/${selectedMotel._id}`,
                              );
                            }}
                          >
                            <FormattedMessage {...messages.Detail} />
                          </button>
                        )}
                      </div>
                    </Col>
                  </Col>
                ) : (
                  <div className="image-container">
                    <Col xs={4} className="image">
                      <img alt="Avatar" src="./defaul-room.jpg" />
                    </Col>
                    <Col xs={8} className="card-content">
                      <div className="card-info">
                        <div className="title">{selectedMotel.name}</div>
                        <div className="address">
                          <LocationOn className="address-icon" />
                          {selectedMotel.address.address}
                        </div>
                        <div className="price">
                          {Money(selectedMotel.minPrice || 0)} -{' '}
                          {Money(selectedMotel.maxPrice || 0)} đ
                        </div>
                        <div className="phone">
                          <Phone className="phone-icon" />
                          {selectedMotel.contactPhone}
                        </div>
                      </div>
                      <div className="button-container">
                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() => props.selectMotel({})}
                        >
                          <FormattedMessage {...messages.Cancel} />
                        </button>
                        <button
                          type="button"
                          className="detail-button"
                          onClick={() => {
                            history.push(`/motel/${selectedMotel._id}`);
                          }}
                        >
                          <FormattedMessage {...messages.Detail} />
                        </button>
                      </div>
                    </Col>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </div>
      )} */}
    </div>
  );
}

MapsPage.propTypes = {
  getMotels: PropTypes.func.isRequired,
  mapsPage: PropTypes.object.isRequired,
  selectMotel: PropTypes.func.isRequired,
  changeStoreData: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  mapsPage: makeSelectMapsPage(),
});

function mapDispatchToProps(dispatch) {
  return {
    getMotels: payload => dispatch(getMotels(payload)),
    selectMotel: payload => dispatch(selectMotel(payload)),
    changeStoreData: (key, value) => {
      dispatch(changeStoreData(key, value));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(MapsPage);
