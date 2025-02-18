/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/**
 *
 * ForgotPassword
 *
 */

import PropTypes from 'prop-types';
import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Avatar } from '@material-ui/core';
import { Button, Col, Container, Row } from 'reactstrap';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';
import Select from 'react-select';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import _ from 'lodash';

import './style.scss';
import makeSelectRoomDetail from './selectors';
import saga from './saga';
import reducer from './reducer';
import CheckBox from '../../components/CheckBox';
import InputForm from '../../components/InputForm';
import {
  changeStoreData,
  postMotel,
  putRoomDetailUpdate,
  putMeter,
  getRoom,
  postQuickDeposit,
  postQuickRent,
  postImage,
  updateRoomStatus,
  postUploadQuickDeposit,
  postUploadQuickRent,
} from './actions';
import messages from './messages';
import ModalComponent from './modal';
import QuickDepositModal from './QuickDepositModal';
import QuickRentModal from './QuickRentModal';
import IdentityVerificationModal from './IdentityVerificationModal';
import { options, utilitiesData } from './mockData';
import { AddElectricMetterModal } from './AddElectricMetterModal';
import { roomStatus } from '../../helper/constants';
import jobReducer from '../Job/reducer';
import jobSaga from '../Job/saga';
import makeSelectJob from '../Job/selectors';
import { deleteJob, getJob } from '../Job/actions';

const validationSchema = Yup.object().shape({
  id: Yup.string().required(),
  name: Yup.string().required(),
  utilities: Yup.array().required(),
  electricityPrice: Yup.number().required(),
  price: Yup.number().required(),
  waterPrice: Yup.number().required(),
  minimumMonths: Yup.number().required(),
  availableDate: Yup.string().required(),
  acreage: Yup.number().required(),
  depositPrice: Yup.number().required(),
  wifiPrice: Yup.number().required(),
  garbagePrice: Yup.number().required(),
  arrayRemoveImg: Yup.array(),
  vihicle: Yup.number().required(),
  person: Yup.number().required(),
  linkVideo: Yup.string(),
  wifiPriceN: Yup.number().required(),
  description: Yup.string(),
});

export function RoomDetail(props) {
  useInjectReducer({ key: 'roomDetail', reducer });
  useInjectSaga({ key: 'roomDetail', saga });

  useInjectReducer({ key: 'job', reducer: jobReducer });
  useInjectSaga({ key: 'job', saga: jobSaga });

  const { id } = useParams();
  const { room = {} } = props.roomDetail;
  const { status = '' } = room;
  const { job = {} } = props.job;

  console.log({ job, room });

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    validationSchema,
    enableReinitialize: true,
    initialValues: {
      id,
      name: room.name || '',
      electricityPrice: room.electricityPrice || '',
      acreage: room.acreage || 0,
      description: room.description || '',
      depositPrice: room.depositPrice || 0,
      vihicle: room.vihicle || 0,
      person: room.person || 0,
      wifiPrice: room.wifiPrice || 0,
      garbagePrice: room.garbagePrice || 0,
      linkVideo: room.linkVideo || '',
      price: room.price || 0,
      wifiPriceN: room.wifiPriceN || 0,
      minimumMonths: room.minimumMonths || 0,
      availableDate: room.availableDate
        ? moment(room.availableDate).format('MM/DD/YYYY')
        : moment(new Date()).format('MM/DD/YYYY'),
      waterPrice: room.waterPrice || 0,
      utilities: room.utilities || [],
      arrayRemoveImg: [],
    },
    onSubmit: values => {
      props.putRoomDetailUpdate(values);
    },
  });

  const [modalDeletedJob, setModalDeleteJob] = useState(false);
  const [arrayImg, setArrayImg] = useState(room.images || []);

  const cancelToggleDeleteJob = () => {
    setModalDeleteJob(!modalDeletedJob);
  };

  const getStatusRoom = status => {
    if (status.toString() === roomStatus.AVAILABLE)
      return <FormattedMessage {...messages.available} />;
    if (status.toString() === roomStatus.RENTED)
      return <FormattedMessage {...messages.rented} />;
    if (status.toString() === roomStatus.DEPOSITED)
      return <FormattedMessage {...messages.deposited} />;
    if (status.toString() === roomStatus.SOONEXPIRECONTRACT)
      return <FormattedMessage {...messages.soonExpireContract} />;
  };

  const handleSelectChange = async e => {
    console.log(getStatusRoom(e.value));
    // prevent change room status from available to rented | deposited | soonExpireContract
    if (status === roomStatus.AVAILABLE) {
      alert(
        `Không thể chuyển từ trạng thái còn trống sang các trạng thái khác. Vui lòng chọn chế độ thuê nhanh hoặc đặt cọc nhanh!`,
      );
      return;
    }

    // Allow change status from rented | deposited | soonExpireContract to available
    if (status === roomStatus.DEPOSITED) {
      // prevent change status from DEPOSITED to SOONEXPIRECONTRACT
      if (e.value === roomStatus.SOONEXPIRECONTRACT) {
        alert(`Không thể thực hiện thao tác này`);
        return;
      }
      // prevent change status from DEPOSITED to RENTED
      if (e.value === roomStatus.RENTED) {
        alert(`Phòng đã được đặt cọc. Vui lòng kích hoạt hợp đồng`);
        return;
      }
      // Allow change status from deposited  to available
      if (e.value === roomStatus.AVAILABLE) {
        if (!_.isEmpty(job)) {
          const today = new Date(job.checkInTime);
          const day = today.getDate();
          const month = today.getMonth() + 1;
          const year = today.getFullYear();
          alert(
            `Thời gian bắt đầu ở của phòng này là ${day}-${month}-${year}, xác nhận thay đổi trạng thái thành phòng trống? Lưu ý: Việc làm này sẽ xóa phòng của người dùng trên!`,
          );
          setModalDeleteJob(true);
        }
      }
    }

    // Allow change status from rented | deposited | soonExpireContract to available
    if (status === roomStatus.RENTED) {
      // prevent change status from RENTED to SOONEXPIRECONTRACT
      if (e.value === roomStatus.SOONEXPIRECONTRACT) {
        alert(`Không thể thực hiện thao tác này`);
        return;
      }
      // prevent change status from RENTED to DEPOSITED
      if (e.value === roomStatus.DEPOSITED) {
        alert(
          `Không thể thực hiện thao tác này. Phòng đã được kích hoạt hợp đồng`,
        );
        return;
      }
      // Allow change status from RENTED to available
      if (e.value === roomStatus.AVAILABLE) {
        if (!_.isEmpty(job)) {
          const today = new Date(job.checkInTime);
          const day = today.getDate();
          const month = today.getMonth() + 1;
          const year = today.getFullYear();
          alert(
            `Thời gian bắt đầu ở của phòng này là ${day}-${month}-${year}, xác nhận thay đổi trạng thái thành phòng trống? Lưu ý: Việc làm này sẽ xóa phòng của người dùng trên!`,
          );
          setModalDeleteJob(true);
        }
      }
    }
  };

  const numberOfMeter = useMemo(() => {
    if (!room.listIdElectricMetter) {
      return 0;
    }
    if (room.listIdElectricMetter.length === 0) {
      return 0;
    }
    return room.listIdElectricMetter.length;
  }, [room.listIdElectricMetter]);

  const handleFileInputChangeFile = async e => {
    const dataFile = e.target.files[0];
    const data = {
      id,
      dataFile,
    };
    props.postImage(data);
  };

  const handleRemoveClick = value => {
    setFieldValue('arrayRemoveImg', [...values.arrayRemoveImg, value]);
    setArrayImg(prevImages => prevImages.filter(image => image !== value));
  };

  useEffect(() => {
    props.getRoom(id);
  }, []);

  useEffect(() => {
    if (status !== roomStatus.AVAILABLE) {
      props.getJob({ id, isDeleted: false });
    }
  }, [status, id]);

  useEffect(() => {
    setArrayImg(room.images || []);
  }, [room]);

  return (
    <div className="login-page-wrapper">
      <Helmet>
        <title>RoomDetailUpdate</title>
        <meta name="description" content="Description of ForgotPassword" />
      </Helmet>
      <Container>
        <ModalComponent
          modal={modalDeletedJob}
          toggle={cancelToggleDeleteJob}
          modalTitle="Cảnh bảo xóa phòng người dùng!"
          footer={
            <div>
              <Button
                variant="outlined"
                color="secondary"
                onClick={cancelToggleDeleteJob}
              >
                Hủy
              </Button>{' '}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  props.deleteJob(id);
                  props.getRoom(id);
                }}
              >
                Xác nhận
              </Button>
            </div>
          }
        >
          <div>
            Thao tác này không thể hoàn tác. Nhấn hủy để hủy thao tác này
          </div>
        </ModalComponent>

        <div className="title mb-3">
          <h3>
            <FormattedMessage {...messages.UpdateRoom} />{' '}
          </h3>
        </div>
        <div className="mb-3 modal-wrapper">
          <QuickDepositModal
            onQuickDeposit={props.postQuickDeposit}
            onUploadQuickDeposit={props.uploadQuickDeposit}
          />
          <QuickRentModal
            onQuickRent={props.postQuickRent}
            uploadQuickRent={props.uploadQuickRent}
          />
          {!_.isEmpty(room) && room.status !== roomStatus.AVAILABLE && (
            <IdentityVerificationModal onPostImage={props.postImage} />
          )}
          <div>
            <Button
              color="primary"
              className="btn-block"
              onClick={() => {
                // Allow change status from RENTED to available
                if (!_.isEmpty(job)) {
                  const today = new Date(job.checkInTime);
                  const day = today.getDate();
                  const month = today.getMonth() + 1;
                  const year = today.getFullYear();
                  alert(
                    `Thời gian bắt đầu ở của phòng này là ${day}-${month}-${year}, xác nhận thay đổi trạng thái thành phòng trống? Lưu ý: Việc làm này sẽ xóa phòng của người dùng trên!`,
                  );
                  setModalDeleteJob(true);
                }
              }}
            >
              Chuyển phòng trống
            </Button>
          </div>
          <AddElectricMetterModal
            numberOfMeter={numberOfMeter}
            putMeter={props.putMeter}
          />
        </div>
        <div className="room__note">
          <div className="room__note-label">Lưu ý: </div>
          <p className="room__note-item">
            - Số tháng thuê tối thiểu: Khi tạo hợp đồng sẽ dựa trên số tháng tối
            thiểu. VD: Số tháng tối thiểu là {values.minimumMonths} tháng thì
            khi tạo hợp đồng, hợp đồng sẽ có thời hạn tối thiểu là{' '}
            {values.minimumMonths} tháng.
          </p>
          <p className="room__note-item">
            - Ngày phòng trống: Tính từ ngày bắt đầu thuê phòng + với số tháng
            thuê. (Hiện tại hệ thống chưa tự động cập nhật trường này, người
            dùng cần tính toán và nhập để thay đổi trường này).
          </p>
          <p className="room__note-item">
            - Giá xe: Giá trên 1 xe. Hệ thống tự động tính toán dựa vào số lượng
            xe và giá xe để hiện thị ở trang chi tiết phòng.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Room description */}
          <Row>
            <Col md={12}>
              <InputForm
                label="Mô tả phòng"
                type="text"
                placeholder="Nhập mô tả phòng"
                name="description"
                value={values.description}
                onChange={handleChange}
              />
            </Col>
          </Row>
          <Row>
            {/* Room status */}
            <Col md={3}>
              <p className="room_status-label">Trạng thái phòng</p>
              <Select
                isDisabled
                placeholder={getStatusRoom(status)}
                // options={options}
                className="mb-3"
                // onChange={e => {
                //   handleSelectChange(e);
                // }}
              />
            </Col>

            {/* Check in time */}
            {job && job.checkInTime && (
              <Col md={3}>
                <DatePicker
                  disabled
                  dateFormat="dd/MM/yyyy"
                  selected={moment(job.checkInTime).toDate()}
                  customInput={
                    <InputForm
                      label="Ngày bắt đầu thuê phòng"
                      icon="fa fa-calendar"
                    />
                  }
                />
              </Col>
            )}

            {/* Rental period month */}
            {job && job.rentalPeriod && (
              <Col md={3}>
                <InputForm
                  label="Số tháng thuê"
                  type="number"
                  value={job.rentalPeriod}
                  disabled
                />
              </Col>
            )}

            {/* Available time */}
            <Col md={3} className="PickerCol">
              <DatePicker
                dateFormat="dd/MM/yyyy"
                selected={moment(values.availableDate, 'MM/DD/YYYY').toDate()}
                onChange={date => {
                  setFieldValue(
                    'availableDate',
                    moment(date).format('MM/DD/YYYY'),
                  );
                }}
                customInput={
                  <InputForm label="Ngày phòng trống" icon="fa fa-calendar" />
                }
              />
            </Col>
          </Row>

          <Row>
            {/* Room name */}
            <Col md={3}>
              <InputForm
                label={<FormattedMessage {...messages.NameRoom} />}
                type="text"
                min={0}
                name="name"
                value={values.name}
                onChange={handleChange}
                touched={touched.name}
                error={errors.name}
                onBlur={handleBlur}
              />
            </Col>

            {/* Minimum months to deposit */}
            <Col md={3}>
              <InputForm
                label={<FormattedMessage {...messages.MinMonthRented} />}
                type="number"
                min={1}
                max={12}
                placeholder="Tháng"
                value={values.minimumMonths}
                name="minimumMonths"
                autoComplete="description"
                onChange={evt => {
                  // eslint-disable-next-line radix
                  const month = parseInt(evt.target.value);
                  if (month > 12) {
                    setFieldValue('minimumMonths', 1);
                  } else {
                    setFieldValue('minimumMonths', month);
                  }
                }}
                touched={touched.minimumMonths}
                error={errors.minimumMonths}
                onBlur={handleBlur}
              />
            </Col>

            {/* Acreage room */}
            <Col md={3}>
              <InputForm
                label={<FormattedMessage {...messages.AcreageRoom} />}
                type="text"
                min={15}
                name="acreage"
                value={values.acreage}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.acreage}
                error={errors.acreage}
              />
            </Col>

            {/* Room price */}
            <Col md={3}>
              <InputForm
                type="number"
                label={<FormattedMessage {...messages.PriceName} />}
                min={0}
                name="price"
                value={values.price}
                onChange={handleChange}
                touched={touched.price}
                error={errors.price}
                onBlur={handleBlur}
              />
            </Col>
          </Row>

          {/* Room service */}
          <Row>
            <Col md={3} xs={6}>
              <InputForm
                label={<FormattedMessage {...messages.electricityPrice} />}
                type="number"
                min={0}
                placeholder="VND"
                value={values.electricityPrice}
                name="electricityPrice"
                onChange={handleChange}
                touched={touched.electricityPrice}
                error={errors.electricityPrice}
                onBlur={handleBlur}
              />
            </Col>
            <Col md={3} xs={6}>
              <InputForm
                label={<FormattedMessage {...messages.waterPrice} />}
                type="number"
                min={0}
                placeholder="VND"
                name="waterPrice"
                value={values.waterPrice}
                autoComplete="waterPrice"
                onChange={handleChange}
                touched={touched.waterPrice}
                error={errors.waterPrice}
                onBlur={handleBlur}
              />
            </Col>
            <Col md={3} xs={6}>
              <InputForm
                label={<FormattedMessage {...messages.wifiPriceN} />}
                type="number"
                min={0}
                placeholder="VND"
                name="wifiPriceN"
                value={values.wifiPriceN}
                autoComplete="wifiPriceN"
                onChange={handleChange}
                touched={touched.wifiPrice}
                error={errors.wifiPrice}
                onBlur={handleBlur}
              />
            </Col>
            <Col xs={6} md={3}>
              <InputForm
                label={<FormattedMessage {...messages.garbagePrice} />}
                type="number"
                min={0}
                placeholder="VND"
                value={values.garbagePrice}
                name="garbagePrice"
                onChange={handleChange}
                touched={touched.garbagePrice}
                error={errors.garbagePrice}
                onBlur={handleBlur}
              />
            </Col>
          </Row>

          {/* Room vehicle */}
          <Row>
            <Col md={3} xs={6}>
              <InputForm
                label={<FormattedMessage {...messages.CountPerson} />}
                type="number"
                min={0}
                value={values.person}
                name="person"
                onChange={handleChange}
                touched={touched.person}
                error={errors.person}
                onBlur={handleBlur}
              />
            </Col>
            <Col md={3} xs={6}>
              <InputForm
                label={<FormattedMessage {...messages.CountVihicle} />}
                type="number"
                min={0}
                value={values.vihicle}
                name="vihicle"
                autoComplete="countVihicle"
                onChange={handleChange}
                touched={touched.vihicle}
                error={errors.vihicle}
                onBlur={handleBlur}
              />
            </Col>
            <Col xs={6} md={3}>
              <InputForm
                label="Giá xe trên 1 xe"
                type="number"
                min={0}
                placeholder="VND"
                value={values.wifiPrice}
                name="wifiPrice"
                autoComplete="wifiPrice"
                onChange={handleChange}
                touched={touched.wifiPrice}
                error={errors.wifiPrice}
                onBlur={handleBlur}
              />
            </Col>
            {/* Deposit price */}
            <Col md={3} xs={6}>
              <InputForm
                label="Tiền Thế Chân"
                type="number"
                min={0}
                placeholder="VND"
                name="depositPrice"
                value={values.depositPrice}
                autoComplete="depositPrice"
                onChange={handleChange}
                touched={touched.depositPrice}
                error={errors.depositPrice}
                onBlur={handleBlur}
              />
            </Col>
          </Row>

          {/* Room images */}
          <Row>
            <Col xs={12} className="mt-2">
              <InputForm
                label="Hình ảnh minh họa"
                type="file"
                id="fileupload"
                accept=".png, .jpg"
                multiple="multiple"
                onChange={e => {
                  handleFileInputChangeFile(e);
                }}
              />
            </Col>
            {arrayImg.length > 0 &&
              arrayImg.map((value, index) => (
                <Col xs={6} md={3} className="text-center">
                  <Avatar
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    style={{
                      width: '100%',
                      height: '200px',
                      margin: '10px auto',
                      position: 'relative',
                    }}
                    variant="square"
                    alt="Avatar"
                    src={value}
                  />
                  <Button
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '15px',
                    }}
                    className="remove-button"
                    onClick={() => {
                      handleRemoveClick(value, index);
                    }}
                    color="primary"
                  >
                    X
                  </Button>
                </Col>
              ))}
          </Row>

          <Row>
            <Col md={12}>
              <h4 className="text-center">
                {<FormattedMessage {...messages.ListRoomAcc} />}
              </h4>
            </Col>
            {utilitiesData.map(item => (
              <Col xs={4} key={item.value}>
                <CheckBox
                  label={item.label}
                  onChange={e => {
                    if (e.target.checked) {
                      setFieldValue('utilities', [
                        ...values.utilities,
                        item.value,
                      ]);
                    } else {
                      // const indexOf = values.utilities.indexOf(item.value);
                      setFieldValue('utilities', [
                        ...values.utilities.filter(
                          utility => utility !== item.value,
                        ),
                      ]);
                    }
                  }}
                  checked={values.utilities.find(
                    utility => utility === item.value,
                  )}
                />
              </Col>
            ))}
          </Row>
          <Row className="mt-3">
            <Col xs={12}>
              <Button
                color="primary"
                className="btn-block mt-3"
                type="submit"
                onClick={() => console.log(values)}
              >
                {<FormattedMessage {...messages.UpdateRoom} />}
              </Button>
            </Col>
          </Row>
        </form>
      </Container>
    </div>
  );
}

RoomDetail.propTypes = {
  job: PropTypes.object.isRequired,
  roomDetail: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  postMotel: PropTypes.func.isRequired,
  changeStoreData: PropTypes.func.isRequired,
  putRoomDetailUpdate: PropTypes.func.isRequired,
  putMeter: PropTypes.func.isRequired,
  getRoom: PropTypes.func.isRequired,
  postImage: PropTypes.func.isRequired,
  postQuickDeposit: PropTypes.func.isRequired,
  postQuickRent: PropTypes.func.isRequired,
  updateRoomStatus: PropTypes.func.isRequired,
  getJob: PropTypes.func.isRequired,
  deleteJob: PropTypes.func.isRequired,
  uploadQuickDeposit: PropTypes.func.isRequired,
  uploadQuickRent: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roomDetail: makeSelectRoomDetail(),
  job: makeSelectJob(),
});

function mapDispatchToProps(dispatch) {
  return {
    postQuickRent: data => dispatch(postQuickRent(data)),
    postQuickDeposit: data => dispatch(postQuickDeposit(data)),
    postImage: data => dispatch(postImage(data)),
    postMotel: data => {
      dispatch(postMotel(data));
    },
    putMeter: data => {
      dispatch(putMeter(data));
    },
    putRoomDetailUpdate: data => {
      dispatch(putRoomDetailUpdate(data));
    },
    changeStoreData: (key, value) => {
      dispatch(changeStoreData(key, value));
    },
    getRoom: id => {
      dispatch(getRoom(id));
    },
    updateRoomStatus: payload => dispatch(updateRoomStatus(payload)),
    getJob: payload => {
      dispatch(getJob(payload));
    },
    deleteJob: payload => dispatch(deleteJob(payload)),
    uploadQuickDeposit: payload => dispatch(postUploadQuickDeposit(payload)),
    uploadQuickRent: payload => dispatch(postUploadQuickRent(payload)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(RoomDetail);
