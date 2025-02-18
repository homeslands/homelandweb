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
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import './style.scss';
import { DropzoneFile } from '../../components/DropzoneFile';

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
  const [modal, setModal] = useState(false);

  const { handleSubmit, setFieldValue, isValid } = useFormik({
    validationSchema,
    enableReinitialize: true,
    initialValues: {
      jobId: !_.isEmpty(job) ? job._id : '',
      frontFile: null,
      backFile: null,
    },
    onSubmit: values => {
      if (!isUploadImg()) onPostImage(values);
    },
  });

  const toggle = () => setModal(!modal);

  const resetModal = () => {
    toggle();
  };

  const renderImages = () => {
    if (!_.isEmpty(job) && !_.isEmpty(job.images)) {
      if (_.isArray(job.images)) {
        return job.images.map(item => (
          <div key={item} className="image-inner">
            <img src={item} alt={item} />
          </div>
        ));
      }
    }
    return [];
  };

  const isUploadImg = () => {
    if (!_.isEmpty(job)) {
      if(job.images.length > 1) {
        return true;
      }
      return false;
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
          {isUploadImg() && (
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
                  hidden={isUploadImg()}
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
                  hidden={isUploadImg()}
                />
              </Col>
            </Row>
            <ModalFooter>
              <Button
                color="primary"
                type="submit"
                disabled={!isValid}
                hidden={isUploadImg()}
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

export default IdentityVerificationModal;
