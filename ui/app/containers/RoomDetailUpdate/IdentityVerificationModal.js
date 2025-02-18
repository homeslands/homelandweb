/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import saga from '../Job/saga';
import reducer from '../Job/reducer';
import makeSelectJob from '../Job/selectors';
import './style.scss';
import { DropzoneFile } from '../../components/DropzoneFile';
import { postImage } from '../Job/actions';

const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];

const validationSchema = Yup.object().shape({
  jobId: Yup.string().required(),
  frontFile: Yup.mixed()
    .required()
    .test(
      'fileSize',
      'File too large',
      value => value && value.size <= 4096 * 1024,
    ) // 4MB
    .test(
      'fileType',
      'Unsupported file format',
      value => value && SUPPORTED_FORMATS.includes(value.type),
    ),
  backFile: Yup.mixed()
    .required()
    .test(
      'fileSize',
      'File too large',
      value => value && value.size <= 4096 * 1024,
    ) // 4MB
    .test(
      'fileType',
      'Unsupported file format',
      value => value && SUPPORTED_FORMATS.includes(value.type),
    ),
});

function IdentityVerificationModal({ job, onPostImage }) {
  useInjectReducer({ key: 'job', reducer });
  useInjectSaga({ key: 'job', saga });
  const [modal, setModal] = useState(false);

  const { handleSubmit, setFieldValue, isValid } = useFormik({
    validationSchema,
    enableReinitialize: true,
    initialValues: {
      jobId: !_.isEmpty(job.job) ? job.job._id : '',
      frontFile: null,
      backFile: null,
    },
    onSubmit: values => {
      if (!isActivated()) onPostImage(values);
    },
  });

  const toggle = () => setModal(!modal);

  const resetModal = () => {
    toggle();
  };

  const renderImages = () => {
    if (!_.isEmpty(job.job) && !_.isEmpty(job.job.images)) {
      if (_.isArray(job.job.images)) {
        return job.job.images.map(item => (
          <div key={item} className="image-inner">
            <img src={item} alt={item} />
          </div>
        ));
      }
    }
    return [];
  };

  const isActivated = () => {
    if (!_.isEmpty(job.job)) {
      return job.job.isActived;
    }
    return false;
  };

  return (
    <div>
      <Button color="primary" className="btn-block" onClick={toggle}>
        Xác minh danh tính
      </Button>
      <Modal isOpen={modal} toggle={resetModal} size="xl" scrollable>
        <ModalHeader toggle={resetModal}>Xác minh danh tính</ModalHeader>
        <ModalBody>
          <div>Vui lòng cung cấp CMND/CCCD để xác minh danh tính</div>
          {isActivated() && (
            <div className="identity-status">(Đã xác minh danh tính)</div>
          )}
          <div className="image-wrapper">{renderImages()}</div>
          <form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <DropzoneFile
                  onDrop={acceptedFiles => {
                    if (_.isArray(acceptedFiles) && acceptedFiles.length > 0)
                      setFieldValue('frontFile', acceptedFiles[0]);
                  }}
                  title="CMND/CCCD mặt trước"
                  hidden={isActivated()}
                  accept={{ 'image/*': [] }}
                />
              </Col>
              <Col md={6}>
                <DropzoneFile
                  accept={{ 'image/*': [] }}
                  onDrop={acceptedFiles => {
                    if (_.isArray(acceptedFiles) && acceptedFiles.length > 0)
                      setFieldValue('backFile', acceptedFiles[0]);
                  }}
                  title="CMND/CCCD mặt sau"
                  hidden={isActivated()}
                />
              </Col>
            </Row>
            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                disabled={!isValid}
                hidden={isActivated()}
              >
                Hoàn thành
              </Button>{' '}
              <Button
                color="secondary"
                onClick={() => {
                  toggle();
                }}
              >
                Hủy
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
}

IdentityVerificationModal.propTypes = {
  job: PropTypes.object.isRequired,
  onPostImage: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  job: makeSelectJob(),
});

const mapDispatchToProps = dispatch => ({
  onPostImage: data => dispatch(postImage(data)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(IdentityVerificationModal);
