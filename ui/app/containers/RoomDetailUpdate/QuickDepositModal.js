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
import { getBankInfo } from '../Job/actions';
import { QuickDepositTabPanel } from './TabPanel';

function QuickDepositModal({ job, bankInfo, ...props }) {
  useInjectReducer({ key: 'job', reducer });
  useInjectSaga({ key: 'job', saga });
  const [modal, setModal] = useState(false);
  const [, setSelectedBank] = useState(undefined);
  const { id } = useParams();
  const { room = {} } = job;

  const toggle = () => setModal(!modal);

  const resetModal = () => {
    setSelectedBank(undefined);
    toggle();
  };

  useEffect(() => {
    props.getBankInfo(id);
  }, [id]);

  return (
    <div>
      <Button color="primary" className="btn-block" onClick={toggle}>
        Đặt cọc nhanh
      </Button>
      <Modal isOpen={modal} toggle={resetModal} size="xl" scrollable>
        <ModalHeader toggle={resetModal}>
          Đặt cọc nhanh
          <div className="modal__description">
            Chủ trọ thực hiện đặt cọc hộ cho người thuê trọ.
          </div>
        </ModalHeader>
        <ModalBody>
          <QuickDepositTabPanel
            room={room}
            bankInfo={bankInfo}
            onQuickDeposit={props.onQuickDeposit}
            onUploadQuickDeposit={props.onUploadQuickDeposit}
          />
        </ModalBody>
      </Modal>
    </div>
  );
}

QuickDepositModal.propTypes = {
  job: PropTypes.object.isRequired,
  bankInfo: PropTypes.object.isRequired,
  getBankInfo: PropTypes.func.isRequired,
  onQuickDeposit: PropTypes.func.isRequired,
  onUploadQuickDeposit: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  job: makeSelectJob(),
  bankInfo: makeSelectBankInfo(),
});

const mapDispatchToProps = dispatch => ({
  getBankInfo: id => {
    dispatch(getBankInfo(id));
  },
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(QuickDepositModal);
