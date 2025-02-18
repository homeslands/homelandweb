/* eslint-disable no-underscore-dangle */
/**
 *
 * Profile
 *
 */

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { DataGrid } from '@mui/x-data-grid';

import { Button } from '@material-ui/core';
import localStore from 'local-storage';
import moment from 'moment';
import axios from 'axios';
import {
  FormGroup,
  Label,
  Input,
  FormFeedback,
  Breadcrumb,
  BreadcrumbItem,
} from 'reactstrap';
import { useParams, NavLink } from 'react-router-dom';
import * as fileDownload from 'js-file-download';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';

import Money from '../App/format';
import SuccessPopup from '../../components/SuccessPopup';
import WarningPopup from '../../components/WarningPopup';

import { changeStoreData, getPayDepositList } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectPayDepositList from './selectors';
import './style.scss';
import { urlLink } from '../../helper/route';
import { notificationController } from '../../controller/notificationController';
import ModalComponent from './modal';

export function OrderMonthlyPendingPayment(props) {
  useInjectReducer({ key: 'historyMonthly', reducer });
  useInjectSaga({ key: 'historyMonthly', saga });

  const [idTransaction] = useState('');
  const [status] = useState('');
  const [modal, setModal] = useState(false);

  const { idMotel = '', nameMotel = '' } = useParams();

  const [loading, setLoading] = useState(false);
  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const downloadFile = async id => {
    startLoading();
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${localStore.get('user').token}`,
      },
    };
    const requestUrl =
      urlLink.api.serverUrl +
      urlLink.api.postExportBillRoomPendingPayByOrder +
      id;
    try {
      const response = await axios.post(
        requestUrl,
        null,
        {
          responseType: 'blob',
        },
        config,
      );
      fileDownload(response.data, 'export.pdf');
      stopLoading();
      notificationController.success('Xuất Hóa Đơn Thành Công');
    } catch (err) {
      stopLoading();
      notificationController.error('Xuất Hóa Đơn Không Thành Công');
    }
  };

  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [, setListOrder] = useState([]);

  const validateEmail = value => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = event => {
    const { value } = event.target;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const downloadAllFile = async () => {
    let listIdOrderTemp = [];
    if (transformedData.length > 0) {
      listIdOrderTemp = transformedData.map(item => item._id);
    }

    if (listIdOrderTemp.length > 0) {
      setModal(!modal);
      setListOrder(listIdOrderTemp);
    } else {
      notificationController.error('Hiện Không Có Hóa Đơn Nào!');
    }
  };

  const cancelToggle = () => {
    setModal(!modal);
  };

  const handleSendMail = async () => {
    if (isValid) {
      setModal(!modal);

      try {
        notificationController.success(
          'Xuất Hóa Đơn Thành Công, Vui Lòng Chờ Trong Giây Lát Và Kiểm Tra Email!',
        );
      } catch (err) {
        stopLoading();
        notificationController.error(err.response.data.errors[0].errorMessage);
      }
    }
  };

  const {
    historyMonthly = [],
    showWarningapprove,
    showSuccessapprove,
    action = 0,
  } = props.historyMonthly;

  useEffect(() => {
    props.getPayDepositList(idMotel);
  }, [action]);

  let transformedData = [];
  if (historyMonthly.length !== 0) {
    transformedData = historyMonthly.map((item, index) => ({
      key: index + 1, // STT
      nameUser: item.userName ? item.userName : '', // Người thuê
      phone: item.userPhone ? item.userPhone : '', // Số điện thoại
      roomName: item.roomName ? item.roomName : '', // Số điện thoại
      amount: `${Money(parseInt(item.amount, 10))} VNĐ`, // Số tiền cọc
      description: item.description,
      keyPayment: item.keyPayment,
      time: moment(new Date(item.createdAt)).format('DD-MM-YYYY'),
      expireTime: moment(new Date(item.expireTime)).format('DD-MM-YYYY'),
      keyOrder: item.keyOrder,
      _id: item._id,
    }));
  }

  const columns = [
    { field: 'key', headerName: 'STT', headerAlign: 'center', width: 120 },
    {
      field: 'roomName',
      headerName: 'Phòng',
      headerAlign: 'center',
      width: 150,
      headerClassName: 'header-bold',
    },
    {
      field: 'nameUser',
      headerName: 'Người thuê',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'time',
      headerName: 'Thời gian tạo',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'expireTime',
      headerName: 'Hạn thanh toán',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'keyOrder',
      headerName: 'Mã hóa đơn',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'amount',
      headerName: 'Số tiền',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
    },
    {
      field: 'bill',
      headerName: 'Hóa đơn',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
      renderCell: params => (
        <Button
          onClick={() => {
            downloadFile(params.row._id);
          }}
          color="primary"
        >
          Xuất Hóa Đơn
        </Button>
      ),
    },
  ];

  return (
    <div className="user-profile-wrapper">
      <Helmet>
        <title>Order Monthly</title>
        <meta name="description" content="Description of History Monthly" />
      </Helmet>
      {/* Breadcrumb */}
      <Breadcrumb className="">
        <BreadcrumbItem>
          <NavLink to={urlLink.home}>Home</NavLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <NavLink to={urlLink.manageMonthlyOrder}>
            Thanh toán hàng tháng
          </NavLink>
        </BreadcrumbItem>
        <BreadcrumbItem>Hóa đơn chờ thanh toán</BreadcrumbItem>
        <BreadcrumbItem>{nameMotel}</BreadcrumbItem>
      </Breadcrumb>

      {/* <div className="title">Hóa hàng tháng chờ thanh toán tòa {nameMotel}</div> */}
      <Button
        style={{
          marginLeft: '10px',
        }}
        onClick={() => {
          downloadAllFile();
        }}
        color="primary"
      >
        Xuất Toàn Bộ Hóa Đơn
      </Button>
      <ModalComponent
        modal={modal}
        toggle={cancelToggle}
        modalTitle="Xuất toàn bộ hóa đơn"
        footer={
          <div>
            <Button variant="outlined" color="secondary" onClick={cancelToggle}>
              Hủy
            </Button>{' '}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleSendMail()}
            >
              Xác nhận
            </Button>
          </div>
        }
      >
        <FormGroup>
          <Label for="email">Vui lòng nhập email nhận hóa đơn</Label>
          <Input
            id="email"
            name="email"
            placeholder="email"
            type="email"
            value={email}
            onChange={handleChange}
            invalid={!isValid && email !== ''}
          />
          <FormFeedback>Vui lòng nhập lại email!</FormFeedback>
        </FormGroup>
        <div>
          Tất cả hóa đơn chờ thanh toán sẽ được gửi vào email bạn cung cấp, vui
          lòng cung cấp chính xác email. Xác nhận xuất hóa đơn!
        </div>
      </ModalComponent>
      {loading && <div className="loading-overlay" />}
      <div className="job-list-wrapper container-fluid">
        <div style={{ width: '100%' }}>
          <DataGrid
            getRowId={row => row.key}
            rows={transformedData}
            columns={columns}
            pageSize={10}
            autoHeight
            isCellEditable={params => params.key}
          />
        </div>
      </div>
      <WarningPopup
        visible={showWarningapprove}
        content="Xác nhận thực hiện?"
        callBack={() => props.approvePendingPayDeposit(idTransaction, status)}
        toggle={() => {
          props.changeStoreData('showWarningapprove', false);
        }}
      />
      <SuccessPopup
        visible={showSuccessapprove}
        content="Thành công!"
        toggle={() => {
          props.changeStoreData('showSuccessapprove', !showSuccessapprove);
        }}
      />
    </div>
  );
}

OrderMonthlyPendingPayment.propTypes = {
  historyMonthly: PropTypes.object.isRequired,
  approvePendingPayDeposit: PropTypes.func.isRequired,
  getPayDepositList: PropTypes.func.isRequired,
  changeStoreData: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  historyMonthly: makeSelectPayDepositList(),
});

function mapDispatchToProps(dispatch) {
  return {
    getPayDepositList: id => {
      dispatch(getPayDepositList(id));
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

export default compose(withConnect)(OrderMonthlyPendingPayment);
