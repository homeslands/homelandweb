/* eslint-disable prettier/prettier */
/* eslint-disable no-alert */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

export const BackupDataModal = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen(!open);

  const [endDate, setEndDate] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');

  const [startDateBackup, setStartDateBackup] = useState('');
  const [formattedStartDateBackup, setFormattedStartDateBackup] = useState('');

  const [endDateBackup, setEndDateBackup] = useState('');
  const [formattedEndDateBackup, setFormattedEndDateBackup] = useState('');

  const getStartDayBackup = () => {
    const startDate = document.getElementById('startDateBackup').value;
    // format startDate to dd/mm/yyyy
    const formattedStartDate = new Date(startDate).toLocaleDateString('en-GB');

    // check if start date is empty
    if (startDate === '') {
      alert('Vui lòng chọn ngày bắt đầu');
      return;
    }
    if (new Date(startDate) > new Date()) {
      alert('Ngày bắt đầu không thể lớn hơn ngày hiện tại');
      return;
    }

    setStartDateBackup(startDate);
    setFormattedStartDateBackup(formattedStartDate);
  };

  const getEndDayBackup = () => {
    const endDate = document.getElementById('endDateBackup').value;
    // format endDate to dd/mm/yyyy
    const formattedEndDate = new Date(endDate).toLocaleDateString('en-GB');

    // check if end date is empty
    if (endDate === '') {
      alert('Vui lòng chọn ngày kết thúc');
      // clear start date
      document.getElementById('startDateBackup').value = '';
      return;
    }
    // check if end day is greater than current day
    if (new Date(endDate) > new Date()) {
      alert('Ngày kết thúc không thể lớn hơn ngày hiện tại');
      return;
    }
    //check if end day is greater than start day
    if (new Date(endDate) < new Date(startDate)) {
      alert('Ngày kết thúc không thể nhỏ hơn ngày bắt đầu');
      //clear end date
      document.getElementById('endDateBackup').value = '';
      return;
    }
    setEndDateBackup(endDate);
    setFormattedEndDateBackup(formattedEndDate);
  };

  return (
    <>
      <Button color="primary">Backup data</Button>
      <Modal isOpen={open} toggle={toggle} className="">
        <ModalHeader toggle={toggle}>Backup Data</ModalHeader>
        <ModalBody>
          <FormGroup onChange={getStartDayBackup}>
            <Label for="startDateBackup">Ngày bắt đầu</Label>
            <Input
              id="startDateBackup"
              name="date"
              placeholder="Ngày bắt đầu..."
              type="date"
            />
          </FormGroup>
          <FormGroup onChange={getEndDayBackup}>
            <Label for="endDateBackup">Ngày kết thúc</Label>
            <Input
              id="endDateBackup"
              name="date"
              placeholder="Ngày kết thúc..."
              type="date"
            />
          </FormGroup>
          <div>
            Bạn có chắc muốn backup dữ liệu từ ngày {formattedStartDateBackup}{' '}
            đến {formattedEndDateBackup} không? Quá trình này có thể mất một
            khoảng thời gian dài.
          </div>
        </ModalBody>
        <ModalFooter>
          <div>
            <Button color="secondary" onClick={toggle}>
              Hủy
            </Button>{' '}
            <Button color="primary" onClick={handleBackupData}>
              Xác nhận
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
