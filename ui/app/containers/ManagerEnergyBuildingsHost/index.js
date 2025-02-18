/* eslint-disable no-underscore-dangle */
/**
 *
 * ManagerEnergyBuildingsHost
 *
 */

import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import Card from '@material-ui/core/Card';
import { HomeRounded, LocationOn } from '@material-ui/icons';
import 'react-toastify/dist/ReactToastify.css';
import localStore from 'local-storage';
import { useHistory, NavLink } from 'react-router-dom';
import { Grid } from '@material-ui/core';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { getMotelList } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectManagerBuildingHost from './selectors';
import './style.scss';
import { urlLink } from '../../helper/route';
import { roleCode } from '../../helper/constants';

export function ManagerEnergyBuildingsHost(props) {
  useInjectReducer({ key: 'motelprofileList', reducer });
  useInjectSaga({ key: 'motelprofileList', saga });

  const currentUser = localStore.get('user') || {};
  const { role = [] } = currentUser;
  const history = useHistory();
  const { motelList } = props.profile;

  useEffect(() => {
    props.getMotelList();
  }, []);

  return (
    <div className="">
      <Helmet>
        <title>Quản lý điện năng các tòa nhà</title>
        <meta name="description" content="Description of Profile" />
      </Helmet>
      {role.length === roleCode.HOST && role[0] === 'host' && (
        <>
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbItem>
              <NavLink to={urlLink.home}>Home</NavLink>
            </BreadcrumbItem>
            <BreadcrumbItem active>Quản lý điện năng</BreadcrumbItem>
          </Breadcrumb>

          {/* Content */}
          <div className="user-profile-wrapper container">
            <Grid lg={12} container spacing={2} className="card-wrap">
              {motelList &&
                motelList.length > 0 &&
                motelList.map((motel, key) => (
                  <Grid
                    className="motel-card"
                    // eslint-disable-next-line react/no-array-index-key
                    key={key}
                    lg={3}
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <div className="icon-card">
                      <HomeRounded style={{ color: 'white' }} />
                    </div>
                    <Card
                      variant="outlined"
                      className="card-container"
                      onClick={() =>
                        history.push(
                          `/manager-energy-rooms-host/${motel._id}/${
                            motel.name
                          }`,
                        )
                      }
                    >
                      <div className="card-content">
                        <div className="card-motel-name">
                          <HomeRounded
                            style={{
                              color: 'gray',
                              height: '22px',
                              width: '22px',
                            }}
                          />
                          {motel.name}
                        </div>
                        <div className="card-motel-address">
                          <LocationOn
                            style={{
                              color: 'gray',
                              height: '22px',
                              width: '22px',
                            }}
                          />
                          {motel.address.address}
                        </div>
                      </div>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </div>
        </>
      )}
    </div>
  );
}

ManagerEnergyBuildingsHost.propTypes = {
  profile: PropTypes.object.isRequired,
  getMotelList: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  profile: makeSelectManagerBuildingHost(),
});

function mapDispatchToProps(dispatch) {
  return {
    getMotelList: () => {
      dispatch(getMotelList());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ManagerEnergyBuildingsHost);
