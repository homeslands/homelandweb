/* eslint-disable prettier/prettier */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Row,
  Col,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import messages from './messages';
import InputForm from '../../components/InputForm';

const validationSchema = Yup.object().shape({
  timeMeter: Yup.string().required(),
  newIdMeter: Yup.string().required(),
});

export const AddElectricMetterModal = ({ putMeter, numberOfMeter }) => {
  const { id } = useParams();
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    validationSchema,
    initialValues: {
      newIdMeter: '',
      timeMeter: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    },
    onSubmit: values => {
      const data = {
        id,
        time: values.timeMeter,
        newIdMeter: values.newIdMeter,
      };
      putMeter(data);
    },
  });

  return (
    <div>
      <Button color="primary" onClick={toggle}>
        {<FormattedMessage {...messages.addMeter} />}
      </Button>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Thêm đồng hồ mới cho phòng!</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <div>
              Hãy chắc chắn đồng hồ cũ không còn hoạt động, thêm đúng ID và thời
              gian hoạt đồng của đồng hồ mới.
            </div>
            <Row>
              <Col md={12}>
                <InputForm
                  type="text"
                  label={<FormattedMessage {...messages.electricMetter} />}
                  name="electricMetter"
                  value={numberOfMeter}
                  readOnly
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <InputForm
                  type="text"
                  label={<FormattedMessage {...messages.idMetter} />}
                  name="newIdMeter"
                  placeholder="Nhập id đồng hồ"
                  value={values.newIdMeter}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.newIdMeter}
                  error={errors.newIdMeter}
                />
              </Col>
              <Col md={6}>
                <InputForm
                  type="datetime"
                  label={<FormattedMessage {...messages.timeMeter} />}
                  name="timeMeter"
                  value={values.timeMeter}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.timeMeter}
                  error={errors.timeMeter}
                />
              </Col>
            </Row>
            <ModalFooter>
              <div>
                <Button variant="outlined" color="secondary" onClick={toggle}>
                  Hủy
                </Button>{' '}
                <Button variant="outlined" color="primary" type="submit">
                  Xác nhận
                </Button>
              </div>
            </ModalFooter>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};

AddElectricMetterModal.propTypes = {
  numberOfMeter: PropTypes.number.isRequired,
  putMeter: PropTypes.func.isRequired,
};
