/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Row, Col, Button, ModalFooter } from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import _ from 'lodash';
import localStorage from 'local-storage';
import { FormattedMessage } from 'react-intl';

import messages from '../../Job/messages';
import InputForm from '../../../components/InputForm';
import { optionsRentalPeriod } from '../../Job/mockData';
import '../style.scss';
import { ConfirmModal } from '../Modals';

const validationSchema = Yup.object().shape({
  roomId: Yup.string().required(),
  checkInTime: Yup.string().required(
    <FormattedMessage {...messages.ErrrCheckInDate} />,
  ),
  phoneNumber: Yup.string().required(
    <FormattedMessage {...messages.ErrrPhone} />,
  ),
  rentalPeriod: Yup.number()
    .required(<FormattedMessage {...messages.ErrrMonth} />)
    .integer(),
  bankId: Yup.string().required(),
  firstName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string(),
  password: Yup.string(),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password'), null],
    'Passwords must match',
  ),
});

export const QuickRentForm = ({ room, bankInfo, onQuickRent }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const { availableDate = new Date(), minimumMonths = 0 } = room;
  const { id } = useParams();
  const user = localStorage.get('user') || {};
  const [selectedBank, setSelectedBank] = useState(undefined);
  const [hasAccount, setHasAccount] = useState(true);

  const formik = useFormik({
    validationSchema,
    enableReinitialize: true,
    initialValues: {
      roomId: id,
      checkInTime: moment(new Date()).isBefore(availableDate)
        ? moment(availableDate).format('DD/MM/YYYY')
        : moment(new Date()).format('DD/MM/YYYY'),
      phoneNumber: !_.isEmpty(user) ? `0${user.phoneNumber.number}` : '',
      rentalPeriod: minimumMonths,
      bankId: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: values => {
      toggle();
    },
  });

  const loadAccountOptions = () => [
    {
      label: 'Đã có tài khoản',
      value: '1',
    },
    {
      label: 'Chưa có tài khoản',
      value: '0',
    },
  ];

  const loadBankOptions = () => {
    if (bankInfo && _.isArray(bankInfo) && bankInfo.length !== 0) {
      return bankInfo.map(bankItem => ({
        label: bankItem.nameTkLable,
        value: bankItem._id,
        bankNumber: bankItem.stk,
        bankUsername: bankItem.nameTk,
      }));
    }
    return [];
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Row>
          <Col md={12} className="mb-1">
            <FormattedMessage {...messages.SelectAccount}>
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
                    placeholder="Đã có tài khoản"
                    options={loadAccountOptions()}
                    onChange={selectedOption => {
                      setHasAccount(selectedOption.value === '1');
                    }}
                  />
                </>
              )}
            </FormattedMessage>
          </Col>
          <Col md={12}>
            <InputForm
              label="Nhập số điện thoại"
              name="phoneNumber"
              icon="fa fa-phone"
              placeholder="Nhập số điện thoại"
              value={formik.values.phoneNumber}
              touched={formik.touched.phoneNumber}
              error={formik.errors.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Col>
          {!hasAccount && (
            <>
              <Col md={12}>
                <InputForm
                  label="Nhập mật khẩu"
                  name="password"
                  type="password"
                  icon="fa fa-lock"
                  placeholder="Nhập mật khẩu"
                  value={formik.values.password}
                  touched={formik.touched.password}
                  error={formik.errors.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
              <Col md={12}>
                <InputForm
                  label="Nhập lại mật khẩu"
                  name="confirmPassword"
                  type="password"
                  icon="fa fa-lock"
                  placeholder="Nhập lại mật khẩu"
                  value={formik.values.confirmPassword}
                  touched={formik.touched.confirmPassword}
                  error={formik.errors.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
              <Col md={4}>
                <InputForm
                  label="Nhập tên"
                  name="firstName"
                  icon="fa fa-user"
                  placeholder="Nhập tên"
                  value={formik.values.firstName}
                  touched={formik.touched.firstName}
                  error={formik.errors.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
              <Col md={4}>
                <InputForm
                  label="Nhập họ"
                  name="lastName"
                  placeholder="Nhập họ"
                  icon="fa fa-user"
                  value={formik.values.lastName}
                  touched={formik.touched.lastName}
                  error={formik.errors.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
              <Col md={4}>
                <InputForm
                  label="Email"
                  name="email"
                  placeholder="Nhập email"
                  icon="fa fa-envelope"
                  value={formik.values.email}
                  touched={formik.touched.email}
                  error={formik.errors.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>
            </>
          )}
        </Row>
        <Row>
          <Col md={12} className="mb-1">
            <FormattedMessage {...messages.SelectBank}>
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
                    placeholder="Chọn ngân hàng"
                    options={loadBankOptions()}
                    onChange={selectedOption => {
                      formik.setFieldValue('bankId', selectedOption.value);
                      setSelectedBank({
                        bankNumber: selectedOption.bankNumber,
                        bankUsername: selectedOption.bankUsername,
                      });
                    }}
                  />
                </>
              )}
            </FormattedMessage>
          </Col>
          {selectedBank && (
            <>
              <Col md={12}>
                <InputForm
                  label="Số tài khoản"
                  name="bankNumber"
                  value={selectedBank.bankNumber}
                  readOnly
                />
              </Col>
              <Col md={12}>
                <InputForm
                  label="Tên tài khoản"
                  name="bankUsername"
                  value={selectedBank.bankUsername}
                  readOnly
                />
              </Col>
            </>
          )}
        </Row>
        <Row>
          <Col md={12}>
            <DatePicker
              dateFormat="dd/MM/yyyy"
              selected={moment(
                formik.values.checkInTime,
                'DD/MM/YYYY',
              ).toDate()}
              onChange={date => {
                formik.setFieldValue(
                  'checkInTime',
                  moment(date).format('DD/MM/YYYY'),
                );
              }}
              minDate={moment(
                formik.values.availableDate,
                'DD/MM/YYYY',
              ).toDate()}
              maxDate={moment(formik.values.availableDate, 'DD/MM/YYYY')
                .add(4, 'days')
                .toDate()}
              customInput={
                <InputForm label="Ngày nhận phòng" icon="fa fa-calendar" />
              }
            />
          </Col>
          <Col md={12}>
            <>
              <label
                style={{
                  fontSize: '14px',
                  marginBottom: '2px',
                  fontWeight: 'bold',
                }}
              >
                <span>Số tháng thuê</span>
              </label>
              <Select
                placeholder={formik.values.rentalPeriod}
                defaultValue={optionsRentalPeriod[formik.values.rentalPeriod]}
                icon="fa fa-usd"
                value={formik.values.rentalPeriod}
                options={optionsRentalPeriod.filter(
                  item => parseInt(item.value, 10) >= minimumMonths,
                )}
                className="mb-3"
                onChange={evt => {
                  formik.setFieldValue('rentalPeriod', evt.value);
                }}
              />
            </>
          </Col>
        </Row>
        <ModalFooter>
          <Button color="primary" type="submit">
            Hoàn thành
          </Button>{' '}
        </ModalFooter>
      </form>
      <ConfirmModal
        isOpen={modal}
        title="Xác nhận chủ trọ thuê nhanh"
        toggle={toggle}
        onConfirm={() => {
          onQuickRent(formik.values);
          toggle();
        }}
        onCancel={toggle}
      >
        <div>
          Tác vụ không thể hoàn tác. Hãy chắc chắn rằng tất cả dữ liệu được điền
          đúng
        </div>
      </ConfirmModal>
    </div>
  );
};

QuickRentForm.propTypes = {
  room: PropTypes.object.isRequired,
  bankInfo: PropTypes.object.isRequired,
  onQuickRent: PropTypes.func.isRequired,
};
