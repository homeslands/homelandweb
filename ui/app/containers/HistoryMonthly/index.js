/* eslint-disable no-console */
/* eslint-disable indent */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/**
 *
 * Profile
 *
 */

import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { DataGrid } from '@mui/x-data-grid';

import { Button } from '@material-ui/core';
import { useParams, NavLink } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import localStoreService from 'local-storage';
import * as fileDownload from 'js-file-download';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import Money from '../App/format';
import SuccessPopup from '../../components/SuccessPopup';
import WarningPopup from '../../components/WarningPopup';
import {
  changeStoreData,
  getPayDepositList,
  approvePendingPayDeposit,
} from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectPayDepositList from './selectors';
import './style.scss';
import { urlLink } from '../../helper/route';
import { notificationController } from '../../controller/notificationController';

export function HistoryMonthly(props) {
  useInjectReducer({ key: 'historyMonthly', reducer });
  useInjectSaga({ key: 'historyMonthly', saga });

  const [idTransaction] = useState('');
  const [status] = useState('');
  const {
    idRoom = '',
    nameRoom = '',
    idMotel = '',
    nameMotel = '',
  } = useParams();
  const [loading, setLoading] = useState(false);

  const startLoading = () => {
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
  };

  const getStatus = item => {
    if (item.status === 'waiting') return 'Đang chờ duyệt';
    if (item.status === 'faild') return 'Thất bại';
    if (item.status === 'success') return 'Thành công';
    if (item.status === 'cancel') return 'Đã hủy';
    return 'N/A';
  };

  const downloadFile = async id => {
    startLoading();
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${localStoreService.get('user').token}`,
      },
    };
    const requestUrl =
      urlLink.api.serverUrl + urlLink.api.postExportBillPaidByOrder + id;
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

  const {
    historyMonthly = [],
    showWarningapprove,
    showSuccessapprove,
    action = 0,
  } = props.historyMonthly;

  useEffect(() => {
    props.getPayDepositList(idRoom);
  }, [action]);

  const transformedData = useMemo(() => {
    if (historyMonthly.length !== 0) {
      return historyMonthly.map((item, index) => ({
        key: index + 1, // STT
        nameUser: `${item.user.lastName} ${item.user.firstName}`, // Người thuê
        phone:
          item.user && item.user.phoneNumber
            ? `${item.user.phoneNumber.countryCode}${
                item.user.phoneNumber.number
              }`
            : 'N/A', // Số điện thoại
        amount: `${Money(parseInt(item.amount, 10))} VNĐ`, // Số tiền cọc
        description: item.description,
        keyPayment: item.keyPayment,
        status: getStatus(item),
        time: moment(new Date(item.createdAt)).format('DD-MM-YYYY'),
        timePaid: moment(new Date(item.updatedAt)).format('DD-MM-YYYY'),
        expireTime: moment(new Date(item.expireTime)).format('DD-MM-YYYY'),
        payment_Method:
          item.paymentMethod === 'cash' ? 'Tiền mặt' : 'Ngân hàng',
        keyOrder: item.keyOrder,
        _id: item._id,
      }));
    }
    return [];
  }, []);

  const columns = [
    { field: 'key', headerName: 'STT', headerAlign: 'center', width: 120 },
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
      headerName: 'Thời gian hết hạn',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'timePaid',
      headerName: 'Thời gian thanh toán',
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
      field: 'payment_Method',
      headerName: 'Phương thức thanh toán',
      headerAlign: 'center',
      width: 250,
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
      // eslint-disable-next-line consistent-return
      renderCell: params => {
        return (
          <Button
            onClick={() => {
              downloadFile(params.row._id);
            }}
            color="primary"
          >
            Xuất Hóa Đơn
          </Button>
        );
      },
    },
  ];

  return (
    <div className="user-profile-wrapper">
      <Helmet>
        <title>History Monthly</title>
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
        <BreadcrumbItem>
          <NavLink
            to={`${
              urlLink.orderMonthlyRoomListByMotel
            }/${idMotel}/${nameMotel}`}
          >
            Lịch sử thanh toán
          </NavLink>
        </BreadcrumbItem>
        <BreadcrumbItem>Tòa {nameMotel}</BreadcrumbItem>
        <BreadcrumbItem>Phòng {nameRoom}</BreadcrumbItem>
      </Breadcrumb>

      <div className="title">
        Lịch sử thanh toán hàng tháng phòng {nameRoom}
      </div>
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

HistoryMonthly.propTypes = {
  historyMonthly: PropTypes.object.isRequired,
  changeStoreData: PropTypes.func.isRequired,
  getPayDepositList: PropTypes.func.isRequired,
  approvePendingPayDeposit: PropTypes.func.isRequired,
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
    approvePendingPayDeposit: (idTransaction, status) => {
      dispatch(approvePendingPayDeposit(idTransaction, status));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(HistoryMonthly);
