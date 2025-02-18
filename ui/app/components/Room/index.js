/* eslint-disable no-underscore-dangle */
/**
 *
 * Room
 *
 */

import React, { useState } from 'react';

import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { Button, Col, Container, Row, UncontrolledCarousel } from 'reactstrap';
import {
  CheckCircleOutlineOutlined,
  InfoOutlined,
  VpnKeyOutlined,
  AttachMoneyOutlined,
  MonetizationOnOutlined,
  LocalAtmOutlined,
  Waves,
  EmojiObjects,
  Wifi,
} from '@material-ui/icons';
import messages from './messages';
import defaultRoomImage from '../../images/defaul-room.jpg';
import Money from '../../containers/App/format';
import useLongPress from './longpress';
import ModalComponent from './modal';
import './style.scss';
import { roomStatus, roomStatusCode } from '../../helper/constants';

function Room(props) {
  const { item = {}, status = '', isEdit } = props;
  const {
    name = '',
    price = '',
    electricityPrice = '',
    waterPrice = '',
    wifiPrice = '',
    images = [],
  } = item;

  const items =
    images.map((image, index) => ({
      key: index,
      src: image,
      altText: '',
      caption: '',
      header: '',
    })) || [];
  const [modal, setModal] = useState(false);
  const history = useHistory();
  const backspaceLongPress = useLongPress(() => {
    history.push(`/update-room/${item._id}`);
  }, 500);

  const renderStatus = () => {
    if (status === '0') {
      if (item.status === 'unknown') {
        return (
          <>
            <InfoOutlined className={ClassNames('icon')} />
            {item.status === 'unknown' ? (
              <FormattedMessage {...messages.unknown} />
            ) : (
              <FormattedMessage {...messages.unknown} />
            )}
          </>
        );
      }
      if (item.status === roomStatus.AVAILABLE) {
        return (
          <>
            <CheckCircleOutlineOutlined className={ClassNames('icon')} />
            {item.status === roomStatus.AVAILABLE ? (
              <FormattedMessage {...messages.available} />
            ) : (
              <FormattedMessage {...messages.unknown} />
            )}
          </>
        );
      }
      if (item.status === roomStatus.RENTED) {
        return (
          <>
            <VpnKeyOutlined className={ClassNames('icon')} />
            {item.status === roomStatus.RENTED ? (
              <FormattedMessage {...messages.rented} />
            ) : (
              <FormattedMessage {...messages.unknown} />
            )}
          </>
        );
      }
      if (item.status === roomStatus.DEPOSITED) {
        return (
          <>
            <AttachMoneyOutlined className={ClassNames('icon')} />
            {item.status === roomStatus.DEPOSITED ? (
              <FormattedMessage {...messages.deposited} />
            ) : (
              <FormattedMessage {...messages.unknown} />
            )}
          </>
        );
      }
      if (item.status === roomStatus.SOONEXPIRECONTRACT) {
        return (
          <>
            <AttachMoneyOutlined className={ClassNames('icon')} />
            {item.status === roomStatus.SOONEXPIRECONTRACT ? (
              <FormattedMessage {...messages.soonExpireContract} />
            ) : (
              <FormattedMessage {...messages.unknown} />
            )}
          </>
        );
      }
      return (
        <>
          <InfoOutlined className={ClassNames('icon')} />
          <FormattedMessage {...messages.unknown} />
        </>
      );
    }
    if (status === '1') {
      if (item.status === roomStatus.RENTED) {
        return (
          <>
            <VpnKeyOutlined className={ClassNames('icon')} />
            {item.status === roomStatus.RENTED ? (
              <FormattedMessage {...messages.rented} />
            ) : (
              <FormattedMessage {...messages.unknown} />
            )}
          </>
        );
      }
      return <FormattedMessage {...messages.unknown} />;
    }
    if (status === '2') {
      if (item.status === roomStatus.AVAILABLE) {
        return (
          <>
            <CheckCircleOutlineOutlined className={ClassNames('icon')} />
            <FormattedMessage {...messages.available} />
          </>
        );
      }
      return <FormattedMessage {...messages.unknown} />;
    }
    if (status === '3') {
      if (item.status === roomStatus.DEPOSITED) {
        return (
          <>
            <AttachMoneyOutlined className={ClassNames('icon')} />
            <FormattedMessage {...messages.deposited} />
          </>
        );
      }
      return <FormattedMessage {...messages.unknown} />;
    }
    if (status === '4') {
      if (item.status === roomStatus.SOONEXPIRECONTRACT) {
        return (
          <>
            <AttachMoneyOutlined className={ClassNames('icon')} />
            <FormattedMessage {...messages.soonExpireContract} />
          </>
        );
      }
      return (
        <>
          <InfoOutlined className={ClassNames('icon')} />
          <FormattedMessage {...messages.unknown} />
        </>
      );
    }
    return null;
  };

  return (
    <div
      role="presentation"
      {...isEdit && {
        ...backspaceLongPress,
      }}
      className={ClassNames(
        'room-box',
        // 1 => rented
        status === roomStatusCode.RENTED && {
          // 'room-other': item.status === roomStatus.AVAILABLE,
          'info-other':
            item.status === roomStatus.AVAILABLE ||
            item.status === roomStatus.DEPOSITED ||
            item.status === roomStatus.SOONEXPIRECONTRACT,
        },
        // 2 => available
        status === roomStatusCode.AVAILABLE && {
          // 'room-other': item.status === roomStatus.RENTED,
          'info-other':
            item.status === roomStatus.RENTED ||
            item.status === roomStatus.DEPOSITED ||
            item.status === roomStatus.SOONEXPIRECONTRACT,
        },
        // 3 => deposited
        status === roomStatusCode.DEPOSITED && {
          // 'room-other': item.status === roomStatus.AVAILABLE,
          'info-other':
            item.status === roomStatus.AVAILABLE ||
            item.status === roomStatus.RENTED ||
            item.status === roomStatus.SOONEXPIRECONTRACT,
        },
        // 4: soonExpireContract
        status === roomStatusCode.SOONEXPIRECONTRACT && {
          // 'room-other': item.status === roomStatus.AVAILABLE,
          'info-other':
            item.status === roomStatus.DEPOSITED ||
            item.status === roomStatus.RENTED ||
            item.status === roomStatus.AVAILABLE,
        },
      )}
      onClick={() => setModal(true)}
    >
      <ModalComponent
        modal={modal}
        toggle={() => setModal(false)}
        className="room-modal"
        modalTitle={<FormattedMessage {...messages.Information} />}
        footer={
          <>
            <Button color="secondary" onClick={() => setModal(false)}>
              <FormattedMessage {...messages.Cancel} />
            </Button>
            <Button
              color="primary"
              onClick={() => history.push(`/room-detail/${item._id}`)}
            >
              <FormattedMessage {...messages.Detail} />
            </Button>
          </>
        }
      >
        <Container>
          <div>
            {items.length > 0 ? (
              <UncontrolledCarousel className="image-slider" items={items} />
            ) : (
              <Row className="room-infor">
                <Col xs={12} className="room-image">
                  <img src={defaultRoomImage} alt="default" />
                </Col>
              </Row>
            )}
            <Row className="room-infor">
              <Col xs={12} className="room-detail">
                <Row>
                  <div className="name-room">
                    <FormattedMessage {...messages.Information} /> {name}
                  </div>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="price-room">
                      <div className="price-title">
                        <MonetizationOnOutlined className="price-icon" />
                        <FormattedMessage
                          {...messages.Price}
                          className="price-text"
                        />
                      </div>
                      {Money(price)} đ
                    </div>
                    <div className="price-deposit">
                      <div className="deposit-title">
                        <LocalAtmOutlined className="deposit-icon" />
                        <FormattedMessage {...messages.DepositPrice} />{' '}
                      </div>
                      {Money(price / 2)} đ
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={4}>
                    <div className="item">
                      <div className="electric-title">
                        <EmojiObjects className="electric-icon" />
                        <FormattedMessage {...messages.electricityPrice} />
                      </div>
                      {Money(electricityPrice)} đ
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="item">
                      <div className="water-title">
                        <Waves className="water-icon" />
                        <FormattedMessage {...messages.waterPrice} />
                      </div>
                      {Money(waterPrice)} đ
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="item">
                      <div className="wifi-title">
                        <Wifi className="wifi-icon" />
                        <FormattedMessage {...messages.wifiPrice} />
                      </div>
                      {Money(wifiPrice)} đ
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Container>
      </ModalComponent>

      <div
        className={ClassNames(
          'room-status',
          status === '0' && {
            available: item.status === roomStatus.AVAILABLE,
            rented: item.status === roomStatus.RENTED,
            deposited: item.status === roomStatus.DEPOSITED,
            soonExpireContract: item.status === roomStatus.SOONEXPIRECONTRACT,
          },
          status === '1' && {
            rented: item.status === roomStatus.RENTED,
          },
          status === '2' && {
            available: item.status === roomStatus.AVAILABLE,
          },
          status === '3' && {
            deposited: item.status === roomStatus.DEPOSITED,
          },
          status === '4' && {
            soonExpireContract: item.status === roomStatus.SOONEXPIRECONTRACT,
          },
        )}
      >
        <span className={ClassNames('status')}>{renderStatus()}</span>
      </div>
      <div className={ClassNames('info')}>
        <div>
          <span>
            <FormattedMessage {...messages.Room} />
          </span>
          {item.status === 'unknown' ? (
            <FormattedMessage {...messages.unknown} />
          ) : (
            item.name
          )}
        </div>
        <div>
          <span>
            <FormattedMessage {...messages.Acreage} />
          </span>
          {item.status === 'unknown' ? 'unknown' : `${item.acreage} m2`}
        </div>
        <div>
          <span>
            <FormattedMessage {...messages.roomPrice} />
          </span>
          {item.price ? `${Money(item.price)} đ` : `Chưa cập nhật`}
        </div>
      </div>
    </div>
  );
}

Room.propTypes = {
  item: PropTypes.object,
  status: PropTypes.string,
  isEdit: PropTypes.bool,
  isHost: PropTypes.bool,
};

export default Room;
