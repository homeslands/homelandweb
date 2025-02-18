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
import localStore from 'local-storage';
import moment from 'moment';
import { useParams, NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';

import Money from '../App/format';
import SuccessPopup from '../../components/SuccessPopup';
import WarningPopup from '../../components/WarningPopup';
import {
  changeStoreData,
  getPayDepositList,
  approvePendingPayDeposit,
  getWithdrawalList,
} from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import makeSelectPayDepositList from './selectors';
import './style.scss';
import { urlLink } from '../../helper/route';

export function WithdrawRequestListHost(props) {
  useInjectReducer({ key: 'pendingAcceptDepositList', reducer });
  useInjectSaga({ key: 'pendingAcceptDepositList', saga });
  const currentUser = localStore.get('user') || {};

  const [idTransaction, setIdTransaction] = useState('');
  const [status, setStatus] = useState('');

  const { role = [] } = currentUser;

  const { userId, motelName } = useParams();

  useEffect(() => {
    props.getWithdrawalList({ userId, motelName });
  }, []);

  const {
    showWarningapprove,
    showSuccessapprove,
  } = props.pendingAcceptDepositList;

  const pendingAcceptDepositList =
    props.pendingAcceptDepositList.withdrawalList || [];

  const getStatus = item => {
    if (item.status === 'waiting') return 'Đang chờ duyệt';
    if (item.status === 'faild') return 'Thất bại';
    if (item.status === 'success') return 'Thành công';
    if (item.status === 'cancel') return 'Đã hủy';
    return 'N/A';
  };

  const transformedData = useMemo(() => {
    if (pendingAcceptDepositList.length !== 0) {
      return pendingAcceptDepositList.map((item, index) => ({
        key: index + 1, // STT
        nameUser: `${item.lastName} ${item.firstName}`, // Người thuê
        motelName: item.motelName ? item.motelName : 'N/A', // Tòa nhà
        amount: `${Money(item.amount)} VNĐ`, // Số tiền cần rút
        description: item.description,
        keyPayment: item.keyPayment,
        bankName: item.bankName,
        accountNumber: item.bankNumber,
        bankOwner: item.bankOwner,
        status: getStatus(item),
        note: item.note,
        time: moment(new Date(item.createdAt)).format('DD-MM-YYYY'),
        payment_Method:
          item.paymentMethod === 'cash' ? 'Tiền mặt' : 'Ngân hàng',
        file: item.file,
        _id: item._id,
      }));
    }
    return [];
  }, []);

  const columns = [
    { field: 'key', headerName: 'STT', headerAlign: 'center', width: 120 },
    {
      field: 'nameUser',
      headerName: 'Người yêu cầu',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
    },
    {
      field: 'keyPayment',
      headerName: 'Mã giao dịch',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'bankName',
      headerName: 'Ngân hàng',
      headerAlign: 'center',
      width: 400,
      headerClassName: 'header-bold',
    },
    {
      field: 'accountNumber',
      headerName: 'Số tài khoản',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'bankOwner',
      headerName: 'Tên chủ tài khoản',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'motelName',
      headerName: 'Tòa nhà',
      headerAlign: 'center',
      width: 150,
      headerClassName: 'header-bold',
    },
    {
      field: 'time',
      headerName: 'Thời gian',
      headerAlign: 'center',
      width: 150,
      headerClassName: 'header-bold',
    },
    {
      field: 'payment_Method',
      headerName: 'Phương thức thanh toán',
      headerAlign: 'center',
      width: 300,
      headerClassName: 'header-bold',
    },
    {
      field: 'amount',
      headerName: 'Số tiền cần rút',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      headerAlign: 'center',
      width: 400,
      headerClassName: 'header-bold',
    },
    {
      field: 'note',
      headerName: 'Ghi chú từ người dùng',
      headerAlign: 'center',
      width: 400,
      headerClassName: 'header-bold',
    },
    {
      field: 'UNC',
      headerName: 'Minh chứng',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
      renderCell: params => (
        <a href={params.row.file} target="bank">
          LINK
        </a>
      ),
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
    },
    {
      field: 'success',
      headerName: 'Chấp nhận',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
      renderCell: params => {
        if (params.row.status === 'Đang chờ duyệt') {
          return (
            <Button
              color="success"
              onClick={() => {
                setIdTransaction(params.row._id);
                setStatus('success');
                props.changeStoreData('showWarningapprove', true);
              }}
            >
              <i className="fa fa-check" aria-hidden="true">
                Chấp Nhận
              </i>
            </Button>
          );
        }
        return '';
      },
    },
    {
      field: 'error',
      headerName: 'Hủy',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
      renderCell: params => {
        if (params.row.status === 'Đang chờ duyệt') {
          return (
            <Button
              color="cancel"
              onClick={() => {
                setIdTransaction(params.row._id);
                setStatus('cancel');
                props.changeStoreData('showWarningapprove', true);
              }}
            >
              <i className="fa fa-check" aria-hidden="true">
                Không chấp nhận
              </i>
            </Button>
          );
        }
        return '';
      },
    },
  ];

  const filteredColumns = columns.filter(column => {
    if (
      (role.length === 1 || role.length === 2) &&
      (column.field === 'error' || column.field === 'success')
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="user-profile-wrapper">
      <Helmet>
        <title>Withdrawal List</title>
        <meta name="description" content="Description of Accept Deposit " />
      </Helmet>

      {/* Breadcrumb */}
      <Breadcrumb className="">
        <BreadcrumbItem>
          <NavLink to={urlLink.home}>Home</NavLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <NavLink to={urlLink.historyRoomHost}>Quản lý tòa</NavLink>
        </BreadcrumbItem>
        <BreadcrumbItem>Tòa {motelName}</BreadcrumbItem>
        <BreadcrumbItem>Yêu cầu rút tiền</BreadcrumbItem>
      </Breadcrumb>

      <div className="title">
        <FormattedMessage {...messages.Header} />
      </div>
      <div className="job-list-wrapper container-fluid">
        <div style={{ width: '100%' }}>
          <DataGrid
            getRowId={row => row.key}
            rows={transformedData}
            columns={filteredColumns}
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

WithdrawRequestListHost.propTypes = {
  pendingAcceptDepositList: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  changeStoreData: PropTypes.func.isRequired,
  approvePendingPayDeposit: PropTypes.func.isRequired,
  getWithdrawalList: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  pendingAcceptDepositList: makeSelectPayDepositList(),
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
    getWithdrawalList: (userId, motelName) => {
      dispatch(getWithdrawalList(userId, motelName));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(WithdrawRequestListHost);
