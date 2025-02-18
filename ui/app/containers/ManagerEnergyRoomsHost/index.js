/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-underscore-dangle */
/**
 *
 * Manager Energy
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import localStore from 'local-storage';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  Typography,
} from '@material-ui/core';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link, useHistory, useParams, NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AccessTime, InsertDriveFile, MoreHoriz } from '@material-ui/icons';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Button from '@material-ui/core/Button';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from '@material-ui/core/Tooltip';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { urlLink } from '../../helper/route';
import reducer from './reducer';
import saga from './saga';
import makeSelectMotelListRoom from './selectors';
import { getMotelInfor } from './actions';
import './style.scss';
import { role, roleCode } from '../../helper/constants';

const electricMetterStyled = room => ({
  color:
    room.listIdElectricMetter && room.listIdElectricMetter.length === 0
      ? 'red'
      : 'green',
  fontWeight:
    (room.listIdElectricMetter && room.listIdElectricMetter.length === 0) ||
    'bold',
  border:
    (room.listIdElectricMetter && room.listIdElectricMetter.length === 0) ||
    !room.listIdElectricMetter
      ? '1px solid red'
      : '1px solid green',
  width: '30px',
  padding: '4px',
  minWidth: '30px', // Sửa đổi minWidth ở đây
  borderRadius: '5px',
  fontSize: '12px',
  backgroundColor:
    (room.listIdElectricMetter && room.listIdElectricMetter.length === 0) ||
    !room.listIdElectricMetter
      ? 'rgba(255, 0, 0, 0.1)'
      : '#DAFFE9',
});

const ManagerEnergyRoomsHost = props => {
  const currentUser = localStore.get('user') || {};

  const { id, name } = useParams();
  const history = useHistory();
  const { listFloor = [] } = props.motelListRoom;

  useInjectReducer({ key: 'motelListRoom', reducer });
  useInjectSaga({ key: 'motelListRoom', saga });

  useEffect(() => {
    props.getMotelInfor(id);
  }, []);

  const cardStyle = {
    border: 'none',
    boxShadow: 'none',
    background: '#FAFAFA',
    maxWidth: '100%',
    borderRadius: '10px',
  };

  const cardIcon = {
    color: '#7B7B7B',
    borderRadius: '50%',
    height: '50px',
    width: '50px',
    backgroundColor: '#18c3a5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '2px 2px 8px 1px rgba(24, 195, 65, 0.35)',
    position: 'relative',
    zIndex: '1',
    top: '25px',
    left: '25px',
  };

  const StyledButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ebebeb;
    border: none;
    color: #797979;
    font-size: 15px;
    padding: 8px 12px;
    transition: background-color 0.5s;
    border-radius: 20px;
    margin: 40px 0 10px 0;
    width: calc(50% - 10px);
    &:hover {
      background-color: #dedede;
    }
    @media (max-width: 600px) {
      width: calc(50% - 20px);
    }
  `;

  const StyleMoreButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 17px;
    color: #a7a7a7;
    transition: all 0.3s;
    &:hover {
      background-color: #eeeeee;
    }
  `;

  const cardNameStyle = {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#7B7B7B',
    fontSize: '20px',
    fontWeight: 'bold',

    width: '100%',
  };

  const cardContentStyle = {
    display: 'flex',
    justifyContent: 'justify-start',
    gap: '4px',
  };

  return (
    <>
      <Helmet>
        <title>Energy</title>
        <meta name="description" content="Description of Energy" />
      </Helmet>
      {currentUser.role.length === roleCode.HOST &&
        currentUser.role.includes(role.HOST) && (
          <>
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbItem>
                <NavLink to={urlLink.home}>Home</NavLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <NavLink to={urlLink.managerEnergyBuildingsHost}>
                  Quản lý điện năng
                </NavLink>
              </BreadcrumbItem>
              <BreadcrumbItem active>{name}</BreadcrumbItem>
            </Breadcrumb>

            <div className="container">
              {/* Report button */}
              <Button
                className="summary-btn"
                onClick={() => {
                  history.push(
                    `/manager-energy-building-summary-report/${id}/${name}`,
                  );
                }}
              >
                <InsertDriveFile className="summary-icon" />
                Báo cáo tổng hợp
              </Button>

              {/* Content */}
              <Grid lg={12} container spacing={2}>
                {listFloor.length > 0 &&
                  listFloor.map(floor =>
                    floor.rooms.map((room, roomIndex) => (
                      <Grid
                        Grid
                        key={`room-${roomIndex}`}
                        item
                        lg={3}
                        md={4}
                        sm={6}
                        xs={12}
                      >
                        <div div style={cardIcon}>
                          <AccessTime style={{ color: 'white' }} />
                        </div>

                        <Card style={cardStyle}>
                          <CardContent>
                            <Typography
                              style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                              }}
                            >
                              <Tooltip
                                title="Xem lịch sử số điện"
                                placement="top"
                                arrow
                              >
                                <Link
                                  to={`/history-energy/${room._id}/${
                                    room.name
                                  }`}
                                >
                                  <StyleMoreButton>
                                    <MoreHoriz />
                                  </StyleMoreButton>
                                </Link>
                              </Tooltip>
                            </Typography>

                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                              style={cardNameStyle}
                            >
                              <div style={cardContentStyle}>
                                Tên phòng: <span>{room.name}</span>
                              </div>
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                              Số lượng đồng hồ: &nbsp;
                              <span style={electricMetterStyled(room)}>
                                {!room.listIdElectricMetter ||
                                (room.listIdElectricMetter &&
                                  room.listIdElectricMetter.length === 0) ? (
                                  <span style={{ fontWeight: 'bold' }}>
                                    Chưa có đồng hồ
                                  </span>
                                ) : (
                                  room.listIdElectricMetter.length
                                )}
                              </span>
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <StyledButton>
                              <div
                                onClick={() => {
                                  history.push(
                                    `/host/follow-energy/${id}/${room._id}/${
                                      room.name
                                    }`,
                                    { motelName: name },
                                  );
                                }}
                                style={{
                                  textDecoration: 'none',
                                  color: '#6d6d6d',
                                }}
                              >
                                Xem chi tiết
                              </div>
                            </StyledButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    )),
                  )}
              </Grid>
            </div>
          </>
        )}
    </>
  );
};

ManagerEnergyRoomsHost.propTypes = {
  motelListRoom: PropTypes.object.isRequired,
  getMotelInfor: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  motelListRoom: makeSelectMotelListRoom(),
});

function mapDispatchToProps(dispatch) {
  return {
    getMotelInfor: id => {
      dispatch(getMotelInfor(id));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

// export default ManagerEnergyRooms;
export default compose(withConnect)(ManagerEnergyRoomsHost);
