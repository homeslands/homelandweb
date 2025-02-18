/* eslint-disable no-underscore-dangle */
/**
 *
 * RoomDetail
 *
 */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import localStoreService from 'local-storage';
import _ from 'lodash';
import {
  MonetizationOnOutlined,
  LocalAtmOutlined,
  Waves,
  EmojiObjects,
  Wifi,
  EditOutlined,
  DeleteOutline,
  RoomService,
  MoreHoriz,
} from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { Button, Col, Container, Row, UncontrolledCarousel } from 'reactstrap';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import Tooltip from '@material-ui/core/Tooltip';
import { Collapse, IconButton } from '@material-ui/core';
import WarningPopup from '../../components/WarningPopup';
import Money from '../App/format';

import { changeStoreData, deleteRoom, getRoom } from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import makeSelectRoomDetail from './selectors';

import defaultRoomImage from '../../images/defaul-room.jpg';

import './style.scss';

export function RoomDetail(props) {
  const { id } = useParams();
  useInjectReducer({ key: 'roomDetail', reducer });
  useInjectSaga({ key: 'roomDetail', saga });
  const [isAdmin, setIsAdmin] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  useEffect(() => {
    if (localStoreService.get('user')) {
      if (_.isArray(localStoreService.get('user').role)) {
        for (
          let index = 0;
          index < localStoreService.get('user').role.length;
          // eslint-disable-next-line no-plusplus
          index++
        ) {
          const element = localStoreService.get('user').role[index];
          if (element === 'master') {
            setIsAdmin(true);
          }
        }
      }
    }
    props.getRoom(id);
  }, []);
  const history = useHistory();
  const { room = {}, showWarningPopup } = props.roomDetail;
  const {
    _id,
    utilities = [],
    name = '',
    price = '',
    electricityPrice = '',
    waterPrice = '',
    wifiPrice = '',
    garbagePrice = '',
    images = [],
    minimumMonths,
    motelRoomDataDetail = {
      owner: '',
      images: [],
      description: '',
    },
    description = '',
  } = room;

  const isEdit = !localStoreService.get('user')
    ? false
    : motelRoomDataDetail.owner === localStoreService.get('user')._id;

  const items =
    images.map((image, index) => ({
      key: index,
      src: image,
      altText: '',
      caption: '',
      header: '',
    })) || [];

  return (
    <div className="room-detail-wrapper">
      <Helmet>
        <title>RoomDetail</title>
        <meta name="description" content="Description of RoomDetail" />
      </Helmet>
      <div className="infor">
        {items.length > 0 && (
          <UncontrolledCarousel className="image-slider" items={items} />
        )}

        <Container>
          <div className="room-container">
            <Row className="room-infor">
              <Col xs={12} sm={4} className="room-image">
                {images && images.length > 0 ? (
                  <img className="image" src={images[0]} alt="motel" />
                ) : (
                  <img className="image" src={defaultRoomImage} alt="motel" />
                )}
              </Col>
              <Col xs={12} sm={8} className="room-detail">
                <div className="room__info">
                  <div className="name-room">
                    <FormattedMessage {...messages.Information} /> {name}
                  </div>
                  <div className="button-container">
                    {localStoreService.get('user') &&
                      (localStoreService.get('user').role.length > 1 &&
                        isEdit && (
                          <>
                            <Tooltip
                              title="Chỉnh sửa thông tin"
                              placement="top"
                              arrow
                            >
                              <IconButton
                                onClick={handleClick}
                                className="action-button"
                              >
                                <MoreHoriz />
                              </IconButton>
                            </Tooltip>
                            <Collapse in={open} className="collapse">
                              <div>
                                <button
                                  type="button"
                                  className="edit-button-detail"
                                  onClick={() => {
                                    history.push(`/room-detail-update/${_id}`);
                                  }}
                                >
                                  <EditOutlined className="edit-icon" />
                                  <FormattedMessage {...messages.EditRoom} />
                                </button>
                                <button
                                  type="button"
                                  className="delete-button-detail"
                                  onClick={() => {
                                    props.changeStoreData(
                                      'showWarningPopup',
                                      true,
                                    );
                                    setOpen(false);
                                  }}
                                >
                                  <DeleteOutline className="delete-icon" />
                                  <FormattedMessage {...messages.DeleteRoom} />
                                </button>
                              </div>
                            </Collapse>
                          </>
                        ))}
                  </div>
                </div>
                <div className="room__price-wrapper">
                  <div className="price-room">
                    <div className="price-title">
                      <MonetizationOnOutlined className="price-icon" />
                      <FormattedMessage
                        {...messages.Price}
                        className="price-text"
                      />
                      <span className="price-text">{Money(price)} đ</span>
                    </div>
                  </div>
                  <div className="price-deposit">
                    <div className="deposit-title">
                      <LocalAtmOutlined className="deposit-icon" />
                      <FormattedMessage {...messages.DepositPrice} />{' '}
                      {Money(price / 2)} đ
                    </div>
                  </div>
                  <div className="minimum-month">
                    <div>
                      <span className="minimum-month-title">
                        <FormattedMessage {...messages.MinimumMonth} />
                        {minimumMonths}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="room__price-service">
                  <div>
                    <div className="item">
                      <div className="electric-title">
                        <EmojiObjects className="electric-icon" />
                        <FormattedMessage {...messages.electricityPrice} />
                      </div>
                      {Money(electricityPrice)} đ
                    </div>
                  </div>
                  <div>
                    <div className="item">
                      <div className="water-title">
                        <Waves className="water-icon" />
                        <FormattedMessage {...messages.waterPrice} />
                      </div>
                      {Money(waterPrice)} đ
                    </div>
                  </div>
                  <div>
                    <div className="item">
                      <div className="wifi-title">
                        <Wifi className="wifi-icon" />
                        <FormattedMessage {...messages.wifiPrice} />
                      </div>
                      {Money(wifiPrice)} đ
                    </div>
                  </div>
                  <div>
                    <div className="item">
                      <div className="garbage-title">
                        <RoomService className="garbage-icon" />
                        <FormattedMessage {...messages.GarbagePrice} />
                      </div>
                      {Money(garbagePrice)} đ
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            <div className="furniture">
              <div className="title">
                <FormattedMessage {...messages.Furniture} />
              </div>
              <div className="furniture__list">
                {utilities.includes('gac_lung') && (
                  <div>
                    <div className="interior-item">
                      <div className="icon">
                        <img src="../stairs.png" alt="stairs" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.Mezzanine} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('tu_quan_ao') && (
                  <div>
                    <div className="interior-item">
                      <div className="icon">
                        <img src="../wardrobe.png" alt="wardrobe" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.Wardrobe} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('tu_bep') && (
                  <div>
                    <div className="interior-item">
                      <div className="icon">
                        <img src="../kitchen.png" alt="kitchen" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.Kitchen} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('san_go') && (
                  <div>
                    <div className="interior-item">
                      <div className="icon">
                        <img src="../dropceiling.png" alt="dropceiling" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.WoodFloor} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('bon_cau') && (
                  <div>
                    <div className="interior-item">
                      <div className="icon">
                        <img src="../toiletbowl.png" alt="toilet" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.toiletBowl} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('bon_rua_mat') && (
                  <div>
                    <div className="interior-item">
                      <div className="icon">
                        <img src="../washstand.png" alt="washstand" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.washstand} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="utilities">
              <div className="title">
                <FormattedMessage {...messages.Utilities} />
              </div>
              <div className="utilities__list">
                {utilities.includes('wifi') && (
                  <div>
                    <div className="furniture-item">
                      <div className="icon">
                        <img src="../wifi.png" alt="wifi" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.wifi} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('giat_ui') && (
                  <div>
                    <div className="furniture-item">
                      <div className="icon">
                        <img src="../laundry.png" alt="laundry" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.washingDrying} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('giu_xe') && (
                  <div>
                    <div className="furniture-item">
                      <div className="icon">
                        <img src="../delivery.png" alt="delivery" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.parkingLot} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('dieu_hoa') && (
                  <div>
                    <div className="furniture-item">
                      <div className="icon">
                        <img
                          src="../air_conditioner.png"
                          alt="air conditioner"
                        />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.AirConditioner} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('don_phong') && (
                  <div>
                    <div className="furniture-item">
                      <div className="icon">
                        <img src="../broom.png" alt="broom" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.clearTheRoom} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('truyen_hinh') && (
                  <div>
                    <div className="furniture-item">
                      <div className="icon">
                        <img src="../television.png" alt="television" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.television} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('gio_giac_tu_do') && (
                  <div>
                    <div className="furniture-item">
                      <div className="icon">
                        <img src="../time.png" alt="time" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.FreeTime} />
                      </div>
                    </div>
                  </div>
                )}
                {utilities.includes('loi_di_rieng') && (
                  <div>
                    <div className="furniture-item">
                      <div className="icon">
                        <img src="../gate.png" alt="gate" />
                      </div>
                      <div className="name">
                        <FormattedMessage {...messages.PrivateEntrance} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="introduce">
              <div className="title">
                <FormattedMessage {...messages.Introduce} />
              </div>
              <div>{description}</div>
            </div>
            <div className="depositButton">
              <Row className="button">
                <Col xs={6} className="button-deposit">
                  {localStoreService.get('user') ? (
                    !isAdmin && (
                      <>
                        <Button
                          onClick={() => {
                            history.push(`/job/${id}`);
                          }}
                          color="primary"
                          className="btn-block"
                          disabled={room.status !== 'available'}
                        >
                          <FormattedMessage {...messages.Deposit} />
                        </Button>
                      </>
                    )
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          history.push(`/auth/login`);
                        }}
                        color="primary"
                        className="btn-block"
                        disabled={room.status !== 'available'}
                      >
                        <FormattedMessage {...messages.Login} />
                      </Button>
                    </>
                  )}
                </Col>
              </Row>
            </div>
          </div>

          {/* <div className="video-responsive">
            <iframe
              width="560"
              height="315"
              // src="https://www.youtube.com/embed/VneFHjHEIjs"
              src={convertYouTubeLinkToEmbed(linkVideo)}
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen />
          </div>
          <br /> */}
        </Container>
      </div>

      <WarningPopup
        visible={showWarningPopup}
        content={<FormattedMessage {...messages.ErrPopup} />}
        // content={<FormattedMessage {...messages.reallyMessage} />}
        callBack={() => props.deleteRoom(id)}
        toggle={() => {
          props.changeStoreData('showWarningPopup', false);
        }}
      />
    </div>
  );
}

RoomDetail.propTypes = {
  getRoom: PropTypes.func,
  roomDetail: PropTypes.object,
  changeStoreData: PropTypes.func,
  deleteRoom: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  roomDetail: makeSelectRoomDetail(),
});

function mapDispatchToProps(dispatch) {
  return {
    getRoom: id => {
      dispatch(getRoom(id));
    },
    deleteRoom: id => {
      dispatch(deleteRoom(id));
    },
    changeStoreData: (key, value) => {
      dispatch(changeStoreData(key, value));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(RoomDetail);
