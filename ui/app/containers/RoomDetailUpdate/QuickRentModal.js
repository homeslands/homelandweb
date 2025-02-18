/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import saga from '../Job/saga';
import reducer from '../Job/reducer';
import makeSelectJob, { makeSelectBankInfo } from '../Job/selectors';
import './style.scss';
import { getBankInfo, getJob } from '../Job/actions';
import { QuickRentTabPanel } from './TabPanel';

function QuickRentModal({ job, bankInfo, ...props }) {
  useInjectReducer({ key: 'job', reducer });
  useInjectSaga({ key: 'job', saga });
  const [modal, setModal] = useState(false);
  const { id } = useParams();
  const { room = {} } = job;

  const toggle = () => setModal(!modal);

  const resetModal = () => {
    toggle();
  };

  useEffect(() => {
    props.getBankInfo(id);
    props.handleGetJob({ id, isDeleted: false });
  }, [id]);

  return (
    <div>
      <Button color="primary" className="btn-block" onClick={toggle}>
        Thuê nhanh
      </Button>
      <Modal isOpen={modal} toggle={resetModal} size="xl" scrollable>
        <ModalHeader toggle={resetModal}>
          Thuê nhanh
          <div className="modal__description">
            Chủ trọ thực hiện thuê hộ cho người thuê trọ. Chức năng này giúp cho
            chủ trọ có thể tạo hợp đồng cho những người thuê trọ trước khi có hệ
            thống.
          </div>
        </ModalHeader>
        <ModalBody>
          <QuickRentTabPanel
            room={room}
            bankInfo={bankInfo}
            onQuickRent={props.onQuickRent}
            uploadQuickRent={props.uploadQuickRent}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

QuickRentModal.propTypes = {
  job: PropTypes.object.isRequired,
  bankInfo: PropTypes.object.isRequired,
  getBankInfo: PropTypes.func.isRequired,
  onQuickRent: PropTypes.func.isRequired,
  handleGetJob: PropTypes.func.isRequired,
  uploadQuickRent: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  job: makeSelectJob(),
  bankInfo: makeSelectBankInfo(),
});

const mapDispatchToProps = dispatch => ({
  getBankInfo: id => {
    dispatch(getBankInfo(id));
  },
  handleGetJob: payload => {
    dispatch(getJob(payload));
  },
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(QuickRentModal);
