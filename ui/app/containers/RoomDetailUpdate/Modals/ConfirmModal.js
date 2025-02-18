/* eslint-disable prettier/prettier */
import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import PropTypes from 'prop-types';

export const ConfirmModal = ({
  title,
  isOpen,
  children,
  toggle,
  onConfirm,
  onCancel,
}) => (
  <Modal isOpen={isOpen} toggle={toggle} centered>
    <ModalHeader>{title || `Xác nhận`}</ModalHeader>
    <ModalBody>{children}</ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={onConfirm}>
        Đặt cọc
      </Button>{' '}
      <Button color="secondary" onClick={onCancel}>
        Hủy
      </Button>
    </ModalFooter>
  </Modal>
);

ConfirmModal.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
