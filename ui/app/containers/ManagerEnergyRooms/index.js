/**
 *
 * Manager Energy
 *
 */

import React, { useEffect } from 'react';
import _ from 'lodash';
import localStore from 'local-storage';
import { createStructuredSelector } from 'reselect';

import {
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import './style.scss';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { getListDeviceEnergy } from './actions';

import reducer from './reducer';
import saga from './saga';
import makeSelectListDeviceEnergy from './selectors';

const ManagerEnergyRooms = props => {
  const currentUser = localStore.get('user') || {};

  useInjectReducer({ key: 'listDeviceEnergy', reducer });
  useInjectSaga({ key: 'listDeviceEnergy', saga });

  // const [roomList, setRoomList] = useState([]);

  const { listDeviceEnergy = [] } = props.listDeviceEnergy;

  useEffect(() => {
    props.getListDeviceEnergy();
  }, []);

  return (
    <div className="container">
      {/* {!_.isEmpty(currentUser) ? ( */}
      <>
        <Helmet>
          <title>Energy</title>
          <meta name="description" content="Description of Energy" />
        </Helmet>
        <div className="title-abc">Quản lý điện năng các phòng</div>
        {/* {currentUser.role.includes('host') && ( */}
        <Grid lg={12} container spacing={2}>
          {listDeviceEnergy.map((room, index) => (
            <>
              <Grid key={index} item lg={3} md={4} sm={6} xs={12}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    alt="green iguana"
                    height="140"
                    image="../../images/air_conditioner.png"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {room.Name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Id đồng hồ: {room.Id}
                    </Typography>
                  </CardContent>
                  <CardActions style={{ justifyContent: 'center' }}>
                    <Link to={`/admin/follow-energy/${room.Id}/${room.Name}`}>
                      <Button variant="contained" size="small">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </CardActions>
                </Card>
              </Grid>
            </>
          ))}
        </Grid>
        {/* )} */}
      </>
      {/* ) : (
        <h1>Không có quyền truy cập</h1>
      )} */}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  listDeviceEnergy: makeSelectListDeviceEnergy(),
});

function mapDispatchToProps(dispatch) {
  return {
    getListDeviceEnergy: () => {
      dispatch(getListDeviceEnergy());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// export default ManagerEnergyRooms;
export default compose(withConnect)(ManagerEnergyRooms);
