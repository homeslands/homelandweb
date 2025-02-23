/**
 *
 * ForgotPassword
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { Container, Button, Col, Row, Alert } from 'reactstrap';

import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import { useParams } from 'react-router';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import * as faker from 'faker';
import InputForm from '../../components/InputForm';
import { cn } from '../../utils/cn';
import CheckBox from '../../components/CheckBox';
import { changeStoreData, putCreateRoom } from './actions';
import makeSelectCreateRoom from './selectors';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';

export function CreateRoom(props) {
  useInjectReducer({ key: 'createRoom', reducer });
  useInjectSaga({ key: 'createRoom', saga });

  const { id } = useParams();
  const [utilities, setUtilities] = useState([]);
  const options = [
    { value: 'available', label: <FormattedMessage {...messages.available} /> },
    { value: 'rented', label: <FormattedMessage {...messages.rented} /> },
    { value: 'unknown', label: <FormattedMessage {...messages.unknown} /> },
    { value: 'deposited', label: <FormattedMessage {...messages.deposited} /> },
  ];
  const number = 1;
  const [dataOptions, setDataOptions] = useState('available');
  const [description, setDescription] = useState('');
  const [electricityPrice, setElectricityPrice] = useState(number);
  const [name, setname] = useState(number);
  const [idElectricMetter, setIdElectricMetter] = useState(0);
  const [acreage, setAcreage] = useState(number);
  const [price, setprice] = useState(number);
  const [waterPrice, setwaterPrice] = useState(number);
  const [minimumMonths, setMinimumMonths] = useState(number);
  const [availableDate, setAvailableDate] = useState(new Date());
  const [depositPrice, setDepositPrice] = useState(number);
  const [roomPassword, setRoomPassword] = useState(
    faker.random.number({ min: 100000, max: 999999, precision: 6 }),
  );
  const [wifiPrice, setWifiPrice] = useState(number);
  const [wifiPriceN, setWifiPriceN] = useState(number);
  const [garbagePrice, setGarbagePrice] = useState(number);

  function handleGetStatusRoom() {
    let statusRoom = '';
    if (dataOptions === 'unknown') {
      statusRoom = <FormattedMessage {...messages.unknown} />;
    } else if (dataOptions === 'rented') {
      statusRoom = <FormattedMessage {...messages.rented} />;
    } else if (dataOptions === 'deposited') {
      statusRoom = <FormattedMessage {...messages.deposited} />;
    } else {
      statusRoom = <FormattedMessage {...messages.available} />;
    }
    return statusRoom;
  }

  return (
    <div className="create-room-wrapper">
      <Helmet>
        <title>CreateRoom</title>
        <meta name="description" content="Description of ForgotPassword" />
      </Helmet>
      <Container>
        <div className="title mb-3">
          <div className="header">
            <FormattedMessage {...messages.CreateNewRoom} />
          </div>
        </div>
        <Row>
          <Col md={3}>
            <InputForm
              label={<FormattedMessage {...messages.NameRoom} />}
              type="text"
              min={0}
              name="name"
              value={name}
              autoComplete="description"
              onChange={evt => {
                setname(evt.target.value);
              }}
            />
          </Col>
          <Col md={3}>
            <InputForm
              label={<FormattedMessage {...messages.electricMetter} />}
              type="text"
              // min={0}
              name="electricMetter"
              value={null}
              autoComplete="description"
              onChange={evt => {
                setIdElectricMetter(evt.target.value);
              }}
            />
          </Col>

          <Col md={6}>
            {/* <h5>Chọn tự động cập nhập</h5> */}
            <label className={cn('room_status')} htmlFor="status">
              Trạng thái phòng:
            </label>
            <Select
              placeholder={handleGetStatusRoom()}
              value={dataOptions}
              options={options}
              className=""
              onChange={e => {
                setDataOptions(e.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <InputForm
              label="Mô tả phòng"
              type="text"
              name="description"
              value={description}
              onChange={evt => {
                setDescription(evt.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <InputForm
              label={<FormattedMessage {...messages.AcreageRoom} />}
              type="text"
              min={15}
              name="acreage"
              value={acreage}
              autoComplete="description"
              onChange={evt => {
                setAcreage(evt.target.value);
              }}
            />
          </Col>
          <Col md={6}>
            <InputForm
              type="number"
              label={<FormattedMessage {...messages.PriceName} />}
              min={0}
              name="minPrice"
              value={price}
              onChange={evt => {
                setprice(evt.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={3} xs={6}>
            <InputForm
              label={<FormattedMessage {...messages.electricityPrice} />}
              type="number"
              min={0}
              placeholder="VND"
              value={electricityPrice}
              name="electricityPrice"
              autoComplete="description"
              onChange={evt => {
                setElectricityPrice(evt.target.value);
              }}
            />
          </Col>
          <Col md={3} xs={6}>
            <InputForm
              label={<FormattedMessage {...messages.waterPrice} />}
              type="number"
              min={0}
              placeholder="VND"
              name="waterPrice"
              value={waterPrice}
              autoComplete="waterPrice"
              onChange={evt => {
                setwaterPrice(evt.target.value);
              }}
            />
          </Col>
          {/* <Col md={4} xs={6}>
            <InputForm
              label="Mã Khóa Phòng"
              type="number"
              min={100000}
              max={999999}
              placeholder="VND"
              value={roomPassword}
              name="roomPassword"
              autoComplete="roomPassword"
              onChange={evt => {
                setRoomPassword(evt.target.value);
              }}
            />
          </Col> */}
          <Col md={3} xs={6}>
            <InputForm
              label={<FormattedMessage {...messages.depositPrice} />}
              type="number"
              min={0}
              placeholder="VND"
              name="depositPrice"
              value={depositPrice}
              autoComplete="depositPrice"
              onChange={evt => {
                setDepositPrice(evt.target.value);
              }}
            />
          </Col>
          <Col xs={6} md={3}>
            <InputForm
              label={<FormattedMessage {...messages.wifiPriceN} />}
              type="number"
              min={0}
              placeholder="VND"
              value={wifiPriceN}
              name="wifiPriceN"
              autoComplete="wifiPriceN"
              onChange={evt => {
                setWifiPriceN(evt.target.value);
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6} md={3}>
            <InputForm
              label={<FormattedMessage {...messages.wifiPrice} />}
              type="number"
              min={0}
              placeholder="VND"
              value={wifiPrice}
              name="wifiPrice"
              autoComplete="wifiPrice"
              onChange={evt => {
                setWifiPrice(evt.target.value);
              }}
            />
          </Col>
          <Col xs={6} md={3}>
            <InputForm
              label={<FormattedMessage {...messages.garbagePrice} />}
              type="number"
              min={0}
              placeholder="VND"
              value={garbagePrice}
              name="garbagePrice"
              autoComplete="description"
              onChange={evt => {
                setGarbagePrice(evt.target.value);
              }}
            />
          </Col>
          <Col md={3} xs={6}>
            <InputForm
              label={<FormattedMessage {...messages.MinMonthRented} />}
              type="number"
              min={1}
              max={12}
              placeholder="Tháng"
              value={minimumMonths}
              name="minimumMonths"
              autoComplete="description"
              onChange={evt => {
                const month = parseInt(evt.target.value);

                if (month > 12) {
                  setMinimumMonths(1);
                } else {
                  setMinimumMonths(month);
                }
              }}
            />
          </Col>
          <Col md={3} xs={6} className="PickerCol">
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={moment(availableDate, 'MM/DD/YYYY').toDate()}
              onChange={date => {
                setAvailableDate(moment(date).format('MM/DD/YYYY'));
              }}
              customInput={
                <InputForm
                  label={<FormattedMessage {...messages.CheckInDate} />}
                  icon="fa fa-calendar"
                />
              }
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h4 className="text-center">
              {<FormattedMessage {...messages.ListRoomAcc} />}
            </h4>
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label="Internet"
              onChange={e => {
                const index = utilities.indexOf('wifi');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('wifi');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.washingDrying} />}
              onChange={e => {
                const index = utilities.indexOf('giat_ui');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('giat_ui');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.parkingLot} />}
              onChange={e => {
                const index = utilities.indexOf('giu_xe');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('giu_xe');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.television} />}
              onChange={e => {
                const index = utilities.indexOf('truyen_hinh');

                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('truyen_hinh');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                  e.checked = false;
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.AirConditioner} />}
              onChange={e => {
                const index = utilities.indexOf('dieu_hoa');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('dieu_hoa');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.toiletBowl} />}
              onChange={e => {
                const index = utilities.indexOf('bon_cau');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('bon_cau');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.Mezzanine} />}
              onChange={e => {
                const index = utilities.indexOf('gac_lung');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('gac_lung');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.washstand} />}
              onChange={e => {
                const index = utilities.indexOf('bon_rua_mat');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('bon_rua_mat');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.clearTheRoom} />}
              onChange={e => {
                const index = utilities.indexOf('don_phong');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('don_phong');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.WoodFloor} />}
              onChange={e => {
                const index = utilities.indexOf('san_go');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('san_go');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.Wardrobe} />}
              onChange={e => {
                const index = utilities.indexOf('tu_quan_ao');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('tu_quan_ao');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.shower} />}
              onChange={e => {
                const index = utilities.indexOf('voi_hoa_sen');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('voi_hoa_sen');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.FreeTime} />}
              onChange={e => {
                const index = utilities.indexOf('gio_giac_tu_do');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('gio_giac_tu_do');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
          <Col xs={6} md={4}>
            <CheckBox
              label={<FormattedMessage {...messages.PrivateEntrance} />}
              onChange={e => {
                const index = utilities.indexOf('loi_di_rieng');
                if (e.target.checked) {
                  if (index === -1) {
                    const newArr = [...utilities];
                    newArr.push('loi_di_rieng');
                    setUtilities(newArr);
                  }
                } else if (index !== -1) {
                  const newArr = [...utilities];
                  newArr.splice(index, 1);
                  setUtilities(newArr);
                }
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            {roomPassword > 999999 && (
              <Alert color="danger" className="mt-3">
                Mã Phòng Phải từ 100.000 đến 999.999
              </Alert>
            )}
            {roomPassword < 100000 && (
              <Alert color="danger" className="mt-3">
                Mã Phòng Phải từ 100.000 đến 999.999
              </Alert>
            )}
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12}>
            <Button
              color="primary"
              className="btn-block mt-3"
              type="submit"
              onClick={() => {
                const data = {
                  utilities,
                  id,
                  name,
                  idElectricMetter,
                  electricityPrice,
                  price,
                  waterPrice,
                  minimumMonths,
                  availableDate,
                  acreage,
                  roomPassword,
                  wifiPrice,
                  wifiPriceN,
                  garbagePrice,
                  depositPrice,
                  description,
                  status: dataOptions,
                };
                if (roomPassword <= 999999 && roomPassword >= 100000) {
                  props.putCreateRoom(data);
                }
              }}
            >
              {<FormattedMessage {...messages.AddRoom} />}
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

CreateRoom.propTypes = {
  dispatch: PropTypes.func,
  postMotel: PropTypes.func,
  createRoom: PropTypes.object,
  changeStoreData: PropTypes.func,
  putCreateRoom: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  createRoom: makeSelectCreateRoom(),
});

function mapDispatchToProps(dispatch) {
  return {
    putCreateRoom: data => {
      dispatch(putCreateRoom(data));
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

export default compose(withConnect)(CreateRoom);
