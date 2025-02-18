/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-duplicates */
/**
 *
 * Job
 *
 */

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import _ from 'lodash';

import { Formik } from 'formik';
import localStore from 'local-storage';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-modal';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { Alert, Button, Col, Container, Row } from 'reactstrap';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import InputForm from '../../components/InputForm';
import Money from '../App/format';
import { getRoom } from '../RoomDetail/actions';
import { changeStoreData, postJob, getBankInfo } from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import makeSelectJob from './selectors';
import makeSelectBankInfo from './selectors';
import './style.scss';
import ModalComponent from './modal';
import { optionsRentalPeriod } from './mockData';

const validateForm = Yup.object().shape({
  checkInTime: Yup.string().required(
    <FormattedMessage {...messages.ErrrCheckInDate} />,
  ),
  fullName: Yup.string().required(
    <FormattedMessage {...messages.ErrrFullName} />,
  ),
  phoneNumber: Yup.string().required(
    <FormattedMessage {...messages.ErrrPhone} />,
  ),
  rentalPeriod: Yup.number()
    .required(<FormattedMessage {...messages.ErrrMonth} />)
    .integer(),
});

export function Job(props) {
  const history = useHistory();
  const { id } = useParams();
  const [type, setType] = useState('cash');
  useInjectReducer({ key: 'job', reducer });
  useInjectSaga({ key: 'job', saga });
  const { room = {}, jobError, jobErrorNuber } = props.job;
  const { bankInfo = [] } = props.bankInfo;

  const {
    name = '',
    price = 0,
    availableDate = new Date(),
    minimumMonths = 0,
    depositPrice = 0,
  } = room;

  useEffect(() => {
    props.getRoom(id);
    props.getBankInfo(id);
    Modal.setAppElement('body');
  }, []);

  useEffect(() => {
    for (let index = 0; index < optionsRentalPeriod.length; index++) {
      const element = optionsRentalPeriod[index];
      if (element.value < minimumMonths) {
        element.isDisabled = true;
      }
    }
  }, []);

  const user = localStore.get('user') || {};
  const [rentalPeriodAction, setRentalPeriodAction] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState('');
  const [selectedBankName, setSelectedBankName] = useState('');
  const [selectedBankNumber, setSelectedBankNumber] = useState('');
  const [selectedBankUsername, setSelectedBankUsername] = useState('');
  const [imageFile] = useState();
  const [isSubmitted, setIsSubmitted] = useState({});
  const [banking, setBanking] = useState('');
  const [keyPayment, setKeyPayment] = useState('');
  const [checkMonth, setCheckMonth] = useState(false);

  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min)) + min;

  const getRandomString = (length, base) => {
    let result = '';
    const baseLength = base.length;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < length; i++) {
      const randomIndex = getRandomInt(0, baseLength);
      result += base[randomIndex];
    }
    return result;
  };

  const getRandomHex2 = () => {
    const baseString = '0123456789ABCDEF';
    return `${getRandomString(8, baseString)}`;
  };

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  function toggleModalTransfer() {
    setIsOpenTransfer(!isOpenTransfer);
  }

  const handleChangeGender = e => {
    const bankValue = e.value;
    // eslint-disable-next-line no-plusplus
    for (let k = 0; k < optionsRentalPeriod.length; k++) {
      const item = optionsRentalPeriod[k];
      if (item.value === bankValue) {
        setRentalPeriodAction(item.value);
        return item.value;
      }
    }
  };

  const SubmitCashModal = () => {
    const requestData = { ...isSubmitted };
    setIsOpenTransfer(!isOpenTransfer);
    setSelectedBankName('');
    setSelectedBankNumber('');
    setSelectedBankUsername('');

    requestData.banking = banking;
    requestData.keyPayment = keyPayment;

    if (requestData.rentalPeriod >= minimumMonths && banking) {
      setCheckMonth(false);
      props.postJob(requestData);
    } else {
      setCheckMonth(true);
      toast.error('Vui lòng chọn ngân hàng');
    }
  };

  const loadBankOptions = () => {
    if (bankInfo.length !== 0) {
      return bankInfo.map(bankItem => ({
        label: bankItem.nameTkLable,
        value: bankItem.id,
        bankName: bankItem.nameTkLable,
        bankNumber: bankItem.stk,
        bankUsername: bankItem.nameTk,
        objectBankId: bankItem._id,
      }));
    }
    return [];
  };

  return (
    <div>
      <Helmet>
        <title>Job</title>
        <meta name="description" content="Description of Job" />
      </Helmet>
      <div className="job-wrapper">
        <Container>
          <div className="payments">
            <div className="name"> Phòng {name}</div>
            <div className="price">{Money(price)} đ</div>
            <div className="title">
              <FormattedMessage {...messages.ErrrPayment} />
            </div>
            <Row className="type-wrapper">
              <Col xs={12}>
                <div
                  className="type"
                  onClick={() => {
                    setType('cash');
                  }}
                  role="presentation"
                >
                  <div>
                    <FormattedMessage {...messages.InternalCash} />
                  </div>
                  {type === 'cash' && (
                    <div className="checked">
                      <img src="/checked.png" alt="checked" />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
          <Formik
            initialValues={{
              roomId: id,
              checkInTime: moment(new Date()).isBefore(availableDate)
                ? moment(availableDate).format('DD/MM/YYYY')
                : moment(new Date()).format('DD/MM/YYYY'),
              fullName: !_.isEmpty(user)
                ? `${user.lastName} ${user.firstName}`
                : '',
              phoneNumber: !_.isEmpty(user)
                ? `${user.phoneNumber.countryCode}${user.phoneNumber.number}`
                : '',
              price,
              bail: depositPrice === 0 ? price : depositPrice,
              total: (
                Number(price) +
                Number(depositPrice === 0 ? price : depositPrice)
              ).toString(),
              deposit: (Number(price) / 2).toString(),
              afterCheckInCost: (
                Number(price) * 0.5 +
                Number(depositPrice === 0 ? price : depositPrice)
              ).toString(),
              availableDate: moment(new Date()).isBefore(availableDate)
                ? moment(availableDate).format('DD/MM/YYYY')
                : moment(new Date()).format('DD/MM/YYYY'),
              rentalPeriod: minimumMonths,
            }}
            enableReinitialize
            validationSchema={validateForm}
            onSubmit={evt => {
              const formData = { ...evt, type };
              if (imageFile) {
                formData.append('imageFile', imageFile);
              }
              if (rentalPeriodAction > 0) {
                formData.rentalPeriod = rentalPeriodAction;
              }

              if (type === 'wallet') {
                setIsSubmitted(formData);
                toggleModal();
              } else if (type === 'cash') {
                setIsSubmitted(formData);
                setIsOpenTransfer(!isOpenTransfer);
              } else {
                alert('Chưa Xử Lý Phần VNPay');
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
            }) => (
              <div>
                <form onSubmit={handleSubmit}>
                  {/* THANH TOÁN CHUYỂN KHOẢN NGÂN HÀNG */}
                  <ModalComponent
                    modal={isOpenTransfer}
                    toggle={toggleModalTransfer}
                    modalTitle="Xác nhận thanh toán chuyển khoản ngân hàng!"
                    footer={
                      <div>
                        <Button color="secondary" onClick={toggleModalTransfer}>
                          <FormattedMessage {...messages.Cancel} />
                        </Button>{' '}
                        <Button onClick={SubmitCashModal} color="primary">
                          <FormattedMessage {...messages.Accept} />
                        </Button>
                      </div>
                    }
                  >
                    <div className="deposit" style={{ minHeight: '200px' }}>
                      <h5>
                        <FormattedMessage {...messages.AmountOfMoney} />{' '}
                        {Money(values.deposit)}
                      </h5>
                      <div style={{ minHeight: '50px' }}>
                        <FormattedMessage {...messages.AmountOfMoneyTransfer} />
                      </div>
                      <div
                        style={{
                          boxShadow:
                            'rgba(3, 7, 18, 0.01) 0px -1px 3px, rgba(3, 7, 18, 0.03) 0px -2px 12px, rgba(3, 7, 18, 0.04) 0px -5px 27px, rgba(3, 7, 18, 0.04) 1px -10px 47px, rgba(3, 7, 18, 0.04) 1px -15px 74px;',
                        }}
                      >
                        <Select
                          placeholder="Chọn ngân hàng"
                          options={loadBankOptions()}
                          onChange={selectedOption => {
                            // Xử lý khi người dùng chọn một ngân hàng
                            // Lưu giá trị được chọn vào state hoặc thực hiện các xử lý khác
                            setSelectedBankName(selectedOption.bankName);
                            setSelectedBankNumber(selectedOption.bankNumber);
                            setSelectedBankUsername(
                              selectedOption.bankUsername,
                            );
                            setBanking(selectedOption.objectBankId);
                            setKeyPayment(getRandomHex2());
                          }}
                        />
                      </div>

                      {/* Hiển thị thông tin về ngân hàng khi đã chọn */}
                      {selectedBankName && (
                        <div
                          style={{
                            position: 'relative',
                            top: '20px',
                            padding: '0px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              paddingBottom: '10px',
                            }}
                          >
                            <span
                              style={{
                                color: 'gray',
                                fontSize: '14px',
                                margin: '0px 0 6px 3px',
                              }}
                            >
                              Ngân hàng
                            </span>
                            <span
                              style={{
                                padding: '8px 8px',
                                border: '1px solid #E2E2E2',
                                borderRadius: '6px',
                              }}
                            >
                              {selectedBankName}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              paddingBottom: '10px',
                            }}
                          >
                            <span
                              style={{
                                color: 'gray',
                                fontSize: '14px',
                                margin: '0px 0 6px 3px',
                              }}
                            >
                              Số tài khoản
                            </span>
                            <span
                              style={{
                                padding: '8px 8px',
                                border: '1px solid #E2E2E2',
                                borderRadius: '6px',
                              }}
                            >
                              {selectedBankNumber}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              paddingBottom: '10px',
                            }}
                          >
                            <span
                              style={{
                                color: 'gray',
                                fontSize: '14px',
                                margin: '0px 0 6px 3px',
                              }}
                            >
                              Tên người nhận
                            </span>
                            <span
                              style={{
                                padding: '8px 8px',
                                border: '1px solid #E2E2E2',
                                borderRadius: '6px',
                              }}
                            >
                              {selectedBankUsername}
                            </span>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              paddingBottom: '10px',
                            }}
                          >
                            <span
                              style={{
                                color: 'gray',
                                fontSize: '14px',
                                margin: '0px 0 6px 3px',
                              }}
                            >
                              Nội dung thanh toán
                            </span>
                            <span
                              style={{
                                padding: '8px 8px',
                                border: '1px solid #E2E2E2',
                                borderRadius: '6px',
                              }}
                            >
                              {keyPayment}
                            </span>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              paddingBottom: '10px',
                            }}
                          >
                            <span
                              style={{
                                color: 'brown',
                                fontSize: '14px',
                                margin: '0px 0 6px 3px',
                              }}
                            >
                              Sau khi bấm "Chấp nhận", bạn sẽ được chuyển đến
                              trang giao dịch. Vui lòng tải ảnh hóa đơn để xác
                              nhận thanh toán và chờ chủ trọ phê duyệt.
                            </span>
                            <span
                              style={{
                                color: 'brown',
                                fontSize: '14px',
                                margin: '0px 0 6px 3px',
                              }}
                            >
                              Sau 24h, nếu giao dịch không được chấp nhận, vui
                              lòng liên hệ admin để xử lý!
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </ModalComponent>

                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={moment(values.checkInTime, 'DD/MM/YYYY').toDate()}
                    onChange={date => {
                      setFieldValue(
                        'checkInTime',
                        moment(date).format('DD/MM/YYYY'),
                      );
                    }}
                    minDate={moment(
                      values.availableDate,
                      'DD/MM/YYYY',
                    ).toDate()}
                    maxDate={moment(values.availableDate, 'DD/MM/YYYY')
                      .add(4, 'days')
                      .toDate()}
                    customInput={
                      <InputForm
                        label={<FormattedMessage {...messages.CheckinDate} />}
                        icon="fa fa-calendar"
                      />
                    }
                  />
                  {
                    <FormattedMessage {...messages.FullName}>
                      {msg => (
                        <InputForm
                          label={
                            <FormattedMessage {...messages.PeopleRomSet} />
                          }
                          placeholder={msg}
                          name="fullName"
                          icon="fa fa-user"
                          value={values.fullName}
                          touched={touched.fullName}
                          error={errors.fullName}
                          autoComplete="fullName"
                          onChange={evt => {
                            handleChange(evt);
                          }}
                          onBlur={handleBlur}
                        />
                      )}
                    </FormattedMessage>
                  }
                  {
                    <FormattedMessage {...messages.EnterPhone}>
                      {msg => (
                        <InputForm
                          label={<FormattedMessage {...messages.Phone} />}
                          placeholder={msg}
                          name="phoneNumber"
                          icon="fa fa-phone"
                          value={values.phoneNumber}
                          touched={touched.phoneNumber}
                          error={errors.phoneNumber}
                          autoComplete="phoneNumber"
                          onChange={evt => {
                            handleChange(evt);
                          }}
                          onBlur={handleBlur}
                        />
                      )}
                    </FormattedMessage>
                  }

                  <InputForm
                    label={<FormattedMessage {...messages.PriceRentedMonth} />}
                    name="price"
                    icon="fa fa-usd"
                    value={Money(values.price)}
                    touched={touched.price}
                    error={errors.price}
                    autoComplete="price"
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                    readOnly
                  />
                  <FormattedMessage {...messages.RentalContract}>
                    {msg => (
                      <>
                        <label
                          style={{
                            fontSize: '14px',
                            marginBottom: '2px',
                            fontWeight: 'bold',
                          }}
                        >
                          <span>{msg}</span>
                        </label>
                        <Select
                          placeholder={values.rentalPeriod}
                          defaultValue={
                            optionsRentalPeriod[values.rentalPeriod]
                          }
                          icon="fa fa-usd"
                          value={values.rentalPeriod}
                          options={optionsRentalPeriod}
                          className="mb-3"
                          onChange={evt => {
                            setFieldValue(
                              'rentalPeriod',
                              handleChangeGender(evt),
                            );
                            setFieldValue(
                              'total',
                              // evt.value * values.price + values.bail,
                              values.price + values.bail,
                            );
                          }}
                        />
                      </>
                    )}
                  </FormattedMessage>
                  <InputForm
                    label={<FormattedMessage {...messages.BondMoney} />}
                    name="bail"
                    icon="fa fa-usd"
                    value={Money(values.bail)}
                    touched={touched.bail}
                    error={errors.bail}
                    autoComplete="new-password"
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                    readOnly
                  />
                  <InputForm
                    label={<FormattedMessage {...messages.TotalMoney} />}
                    name="total"
                    icon="fa fa-usd"
                    value={Money(values.total)}
                    touched={touched.total}
                    error={errors.total}
                    autoComplete="total"
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                    readOnly
                  />
                  <InputForm
                    label={<FormattedMessage {...messages.Deposited} />}
                    name="deposit"
                    icon="fa fa-usd"
                    value={Money(values.deposit)}
                    touched={touched.deposit}
                    error={errors.deposit}
                    autoComplete="deposit"
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                    readOnly
                  />
                  <InputForm
                    label={
                      <FormattedMessage {...messages.PaymentUponCheckIn} />
                    }
                    name="afterCheckInCost"
                    icon="fa fa-usd"
                    value={Money(values.afterCheckInCost)}
                    touched={touched.afterCheckInCost}
                    error={errors.afterCheckInCost}
                    autoComplete="afterCheckInCost"
                    onChange={evt => {
                      handleChange(evt);
                    }}
                    onBlur={handleBlur}
                    readOnly
                  />
                  <DatePicker
                    dateFormat="dd/MM/yyyy"
                    selected={moment(
                      values.availableDate,
                      'DD/MM/YYYY',
                    ).toDate()}
                    customInput={
                      <InputForm
                        label={<FormattedMessage {...messages.BlankFromDate} />}
                        icon="fa fa-calendar"
                      />
                    }
                    readOnly
                  />

                  {/* jobErrorNuber === 1: Create Job Fail */}
                  {jobErrorNuber === 1 && (
                    <Container>
                      <Alert color="danger">
                        {jobError.errorMessage}
                        {/* {props.changeStoreData('jobErrorNuber', 0)} */}
                      </Alert>
                    </Container>
                  )}

                  {/* jobErrorNuber === 2: Create Job Succeed */}
                  {jobErrorNuber === 2 && (
                    <div className="link">
                      {props.changeStoreData('jobErrorNuber', 0)}
                      {/* {history.push(`/job-verify/${room.data.data.job}`)} */}
                      {history.push(`/profile`)}
                    </div>
                  )}
                  <Row>
                    <Col xs={12}>
                      {checkMonth === true && (
                        <Alert color="danger" className="mt-3">
                          Hợp đồng cho thuê >= {minimumMonths}
                        </Alert>
                      )}
                    </Col>
                  </Row>
                  <div className="login">
                    <Button color="primary" type="submit" className="btn-block">
                      {<FormattedMessage {...messages.Finish} />}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </Formik>

          {/* <button onClick={toggleModal}>Open modal</button> */}
        </Container>
      </div>
    </div>
  );
}

Job.propTypes = {
  getRoom: PropTypes.func,
  job: PropTypes.object,
  postJob: PropTypes.func,
  bankInfo: PropTypes.array,
  getBankInfo: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  job: makeSelectJob(),
  bankInfo: makeSelectBankInfo(),
});

function mapDispatchToProps(dispatch) {
  return {
    getRoom: id => {
      dispatch(getRoom(id));
    },
    postJob: formData => {
      dispatch(postJob(formData));
    },
    getBankInfo: id => {
      dispatch(getBankInfo(id));
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

export default compose(withConnect)(Job);
