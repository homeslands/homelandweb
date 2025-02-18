/* eslint-disable no-shadow */
/* eslint-disable no-console */
/**
 *
 * UpdateMotel
 *
 */

import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import { Button, Col, Container, Row } from 'reactstrap';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import * as Yup from 'yup';
import { Avatar } from '@material-ui/core';
import _ from 'lodash';

import InputForm from '../../components/InputForm';
import InputLocation from '../../components/InputLocation';
import { getMotel } from '../Motel/actions';
import { changeStoreData, postImage, putMotel } from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import makeSelectUpdateMotel from './selectors';
import './style.scss';

const validationSchema = Yup.object().shape({
  name: Yup.string().required(<FormattedMessage {...messages.errorName} />),
  address: Yup.string().required(
    <FormattedMessage {...messages.errorAddress} />,
  ),
  minPrice: Yup.string().required(
    <FormattedMessage {...messages.errorMinPrice} />,
  ),
  maxPrice: Yup.string().required(
    <FormattedMessage {...messages.errorMaxPrice} />,
  ),
  contactPhone: Yup.string().required(
    <FormattedMessage {...messages.errorContactPhone} />,
  ),
  description: Yup.string().required(
    <FormattedMessage {...messages.errorDescription} />,
  ),
  electricityPrice: Yup.string().required(
    <FormattedMessage {...messages.erroreLectricityPrice} />,
  ),
  waterPrice: Yup.string().required(
    <FormattedMessage {...messages.errorWaterPrice} />,
  ),
  wifiPrice: Yup.string().required(
    <FormattedMessage {...messages.errorwifiPrice} />,
  ),
  wifiPriceN: Yup.string().required(
    <FormattedMessage {...messages.errorwifiPriceN} />,
  ),
  garbagePrice: Yup.string().required(
    <FormattedMessage {...messages.errorgarbagePrice} />,
  ),
  removedImg: Yup.array(),
});

export function UpdateMotel(props) {
  useInjectReducer({ key: 'updateMotel', reducer });
  useInjectSaga({ key: 'updateMotel', saga });

  const { id } = useParams();
  const { motel = {} } = props.updateMotel;
  const {
    name = '',
    contactPhone = '',
    minPrice = 0,
    maxPrice = 0,
    address = '',
    description = '',
    electricityPrice = 0,
    waterPrice = 0,
    garbagePrice = 0,
    wifiPrice = 0,
    wifiPriceN = 0,
    images = [],
  } = motel;
  const [arrayImg, setArrayImg] = useState(images || []);

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
  } = useFormik({
    validationSchema,
    initialValues: {
      name,
      contactPhone,
      minPrice,
      maxPrice,
      electricityPrice,
      waterPrice,
      garbagePrice,
      wifiPrice,
      wifiPriceN,
      description,
      address,
      imagesView: [],
      removedImg: [],
    },
    enableReinitialize: true,
    onSubmit: values => {
      props.putMotel(id, values);
    },
  });

  const handleRemoveClick = value => {
    setFieldValue('removedImg', [...values.removedImg, value]);
    setArrayImg(prevImages => prevImages.filter(image => image !== value));
  };

  const handleFileInputChangeFile = async e => {
    const dataFile = e.target.files[0];
    const data = {
      id,
      dataFile,
    };
    props.postImage(data);
  };

  useEffect(() => {
    props.getMotelInfor(id);
  }, []);

  useEffect(() => {
    if (!_.isEmpty(motel)) {
      setArrayImg(motel.images);
    }
  }, [motel]);

  return (
    <div className="update-motel-wrapper">
      <Helmet>
        <title>UpdateMotel</title>
        <meta name="description" content="Description of UpdateMotel" />
      </Helmet>
      <Container>
        <form onSubmit={handleSubmit}>
          <Row>
            <Col xs={12}>
              <div className="title">
                <FormattedMessage {...messages.UpdateMotel} />
              </div>
            </Col>
            <Col xs={6} md={3}>
              <InputForm
                label={<FormattedMessage {...messages.electricityPrice} />}
                type="number"
                min={0}
                placeholder="VND"
                name="electricityPrice"
                autoComplete="description"
                value={values.electricityPrice}
                touched={touched.electricityPrice}
                error={errors.electricityPrice}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Col>
            <Col xs={6} md={3}>
              <InputForm
                label={<FormattedMessage {...messages.waterPrice} />}
                type="number"
                min={0}
                placeholder="VND"
                name="waterPrice"
                autoComplete="waterPrice"
                value={values.waterPrice}
                touched={touched.waterPrice}
                error={errors.waterPrice}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Col>
            <Col xs={6} md={3}>
              <InputForm
                label={<FormattedMessage {...messages.wifiPrice} />}
                type="number"
                min={0}
                placeholder="VND"
                name="wifiPrice"
                autoComplete="wifiPrice"
                value={values.wifiPrice}
                touched={touched.wifiPrice}
                error={errors.wifiPrice}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Col>
            <Col xs={6} md={3}>
              <InputForm
                label={<FormattedMessage {...messages.wifiPriceN} />}
                type="number"
                min={0}
                placeholder="VND"
                name="wifiPriceN"
                autoComplete="wifiPriceN"
                value={values.wifiPriceN}
                touched={touched.wifiPriceN}
                error={errors.wifiPriceN}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Col>
            <Col xs={6} md={3}>
              <InputForm
                label={<FormattedMessage {...messages.garbagePrice} />}
                type="number"
                min={0}
                placeholder="VND"
                name="garbagePrice"
                autoComplete="garbagePrice"
                value={values.garbagePrice}
                touched={touched.garbagePrice}
                error={errors.garbagePrice}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <InputForm
                type="number"
                label={<FormattedMessage {...messages.minPrice} />}
                min={0}
                name="minPrice"
                value={values.minPrice}
                touched={touched.minPrice}
                error={errors.minPrice}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Col>
            <Col xs={6}>
              <InputForm
                className="input-price"
                type="number"
                label={<FormattedMessage {...messages.maxPrice} />}
                min={0}
                name="maxPrice"
                value={values.maxPrice}
                touched={touched.maxPrice}
                error={errors.maxPrice}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Col>
          </Row>
          {
            <FormattedMessage {...messages.enterDescription}>
              {msg => (
                <InputForm
                  type="textarea"
                  label={msg}
                  placeholder={msg}
                  name="description"
                  autoComplete="description"
                  value={values.description}
                  touched={touched.description}
                  error={errors.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              )}
            </FormattedMessage>
          }
          <Row>
            <Col xs={6}>
              {
                <FormattedMessage {...messages.EnterNumberPhone}>
                  {msg => (
                    <InputForm
                      label={msg}
                      placeholder={msg}
                      name="contactPhone"
                      autoComplete="contactPhone"
                      value={values.contactPhone}
                      touched={touched.contactPhone}
                      error={errors.contactPhone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  )}
                </FormattedMessage>
              }
            </Col>
            <Col xs={6}>
              {
                <FormattedMessage {...messages.enterMotelName}>
                  {msg => (
                    <InputForm
                      label={msg}
                      placeholder={msg}
                      name="name"
                      autoComplete="name"
                      value={values.name}
                      touched={touched.name}
                      error={errors.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  )}
                </FormattedMessage>
              }
            </Col>
            <Col xs={12}>
              <FormattedMessage {...messages.Address}>
                {msg => (
                  <InputLocation
                    label={msg}
                    placeholder={msg}
                    name="address"
                    value={values.address.address}
                    autoComplete="address"
                    touched={touched.address}
                    error={errors.address}
                    onSelect={address => {
                      setFieldValue('address', address.formatted_address);
                    }}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <input
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
                      handleRemoveClick(value);
                    }}
                    color="primary"
                  >
                    X
                  </Button>
                </Col>
              ))}
          </Row>
          <Button color="primary" className="btn-block mt-3" type="submit">
            {<FormattedMessage {...messages.Update} />}
          </Button>
          {/* <Row>
            <Col xs={6}>
              <input
                type="file"
                id="fileupload"
                accept=".png, .jpg"
                multiple="multiple"
                onChange={e => {
                  handleFileInputChange(e);
                }}
              />
              {submitAction === true ? (
                <Alert color="danger" className="mt-3">
                  {<FormattedMessage {...messages.SizeImage} />}
                </Alert>
              ) : (
                ''
              )}
            </Col>

            <Button color="primary" className="btn-block mt-3" type="submit">
              {<FormattedMessage {...messages.Update} />}
            </Button>
          </Row> */}
        </form>
      </Container>
    </div>
  );
}

UpdateMotel.propTypes = {
  updateMotel: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  changeStoreData: PropTypes.func.isRequired,
  putMotel: PropTypes.func.isRequired,
  postImage: PropTypes.func.isRequired,
  getMotelInfor: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  updateMotel: makeSelectUpdateMotel(),
});

function mapDispatchToProps(dispatch) {
  return {
    postImage: data => dispatch(postImage(data)),
    getMotelInfor: id => {
      dispatch(getMotel(id));
    },
    putMotel: (id, data) => {
      dispatch(putMotel(id, data));
    },
    postImg: (id, data) => {
      dispatch(postImage(id, data));
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

export default compose(withConnect)(UpdateMotel);
