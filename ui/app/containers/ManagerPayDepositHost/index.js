/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * Profile
 *
 */

import PropTypes from 'prop-types';
import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { DataGrid } from '@mui/x-data-grid';

import { Button } from '@material-ui/core';
import localStore from 'local-storage';
import { useHistory, useParams, NavLink } from 'react-router-dom';
import { CloudUpload } from '@material-ui/icons';
import moment from 'moment';
import axios from 'axios';
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

export function ManagerPayDepositHost(props) {
  useInjectReducer({ key: 'payDepositList', reducer });
  useInjectSaga({ key: 'payDepositList', saga });
  const currentUser = localStore.get('user') || {};
  const history = useHistory();
  const fileRefs = useRef({});
  const [idTransaction, setIdTransaction] = useState('');
  const [status, setStatus] = useState('');
  const [urlImgCloud, setUrlImgCloud] = useState('');
  const { role = [] } = currentUser;
  const { id } = useParams();
  const {
    payDepositList = [],
    showWarningapprove,
    showSuccessapprove,
    action = 0,
  } = props.payDepositList;

  useEffect(() => {
    props.getPayDepositList(id);
  }, [action, urlImgCloud]);

  const getReasonNoPay = item => {
    if (item.reasonNoPay === 'noActive') return 'Chưa active phòng';
    if (item.reasonNoPay === 'noPayAterCheckInCost')
      return 'Không thanh sau khi nhận phòng';
    if (item.reasonNoPay === 'noPayMonthly')
      return 'Không thanh toán hàng tháng';
    return 'N/A';
  };

  const getStatus = item => {
    if (item.status === 'pendingPay' && item.type === 'payDeposit')
      return 'Đang chờ thanh toán';
    if (item.status === 'paid' && item.type === 'payDeposit')
      return 'Đã thanh toán';
    return 'N/A';
  };

  const transformedData = payDepositList.map((item, index) => ({
    key: index + 1, // STT
    user: `${item.user.lastName} ${item.user.firstName}`, // Người thuê
    phone: item.user.phoneNumber.countryCode + item.user.phoneNumber.number, // Số điện thoại
    room: item.room.name, // Phòng
    amount: `${Money(item.amount)} VNĐ`, // Số tiền cọc
    type: item.type === 'noPayDeposit' ? 'Không trả cọc' : 'Trả cọc', // Loại (Trả cọc/ Không trả cọc)
    reasonNoPay: getReasonNoPay(item),
    status: getStatus(item),
    _id: item._id, // ID của đối tượng
    time: moment(new Date(item.createdAt)).format('DD/MM/YYYY'),
    file: item.file ? item.file : null,
  }));

  const columns = [
    { field: 'key', headerName: 'STT', headerAlign: 'center', width: 120 },
    {
      field: 'user',
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
      field: 'room',
      headerName: 'Phòng',
      headerAlign: 'center',
      width: 150,
      headerClassName: 'header-bold',
    },
    {
      field: 'time',
      headerName: 'Thời gian',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'amount',
      headerName: 'Số tiền cọc',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
    },
    {
      field: 'type',
      headerName: 'Loại (Trả cọc/ Không trả cọc)',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
    },
    {
      field: 'reasonNoPay',
      headerName: 'Lý do không trả cọc',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
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
      // eslint-disable-next-line consistent-return
      renderCell: params => {
        // eslint-disable-next-line no-unused-expressions
        if (
          params.row.type === 'Trả cọc' &&
          params.row.status === 'Đang chờ thanh toán'
        ) {
          return (
            <Button
              color="success"
              onClick={() => {
                /* eslint no-underscore-dangle: 0 */
                // eslint-disable-next-line no-undef
                setIdTransaction(params.row._id);
                // idTransaction = params.row._id;
                // eslint-disable-next-line no-undef
                setStatus('paid');
                // eslint-disable-next-line no-undef
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
      field: 'action-1',
      headerName: 'Tải minh chứng',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
      renderCell: params => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '5px',
            alignItems: 'center',
          }}
        >
          <input
            type="file"
            // ref={fileInputRef}
            ref={el => (fileRefs.current[params.row._id] = el)}
            style={{ display: 'none' }} // Ẩn thẻ input
            onChange={evt => {
              handleFileChange(evt, params.row._id);
            }}
          />
          <CloudUpload
            style={{ fontSize: 40, cursor: 'pointer' }} // Kích thước của icon và con trỏ chuột
            // onClick={handleIconClick}
            onClick={() => fileRefs.current[params.row._id].click()}
          />
        </div>
      ),
    },
    {
      field: 'iamgeLink',
      headerName: 'Minh chứng đã tải',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
      renderCell: params => (
        <a href={params.row.file} target="bank">
          LINK
        </a>
      ),
    },
    {
      field: 'action-2',
      headerName: 'Chi tiết',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
      renderCell: params => (
        <>
          <a
            className="btn-detail"
            onClick={() => {
              history.push(
                `/manage-deposit/pay-deposit/${id}/list-order-no-pay/${
                  params.row._id
                }`,
              );
            }}
          >
            Xem chi tiết
          </a>
        </>
      ),
    },
  ];

  const filteredColumns = columns.filter(column => {
    if (
      ((role.length === 1) &&
        column.field === 'success') ||
      ((role.length === 1) && column.field === 'action-1')
    ) {
      return false;
    }
    return true;
  });

  const handleFileChange = async (e, key) => {
    const abcfile = e.target.files[0];
    const formData = new FormData();
    formData.append('file', abcfile);

    try {
      const data = {
        // eslint-disable-next-line no-underscore-dangle
        id: key,
        formData,
      };
      apiPostImg(data);
    } catch (error) {
      console.error({ error });
    }
  };

  const apiPostImg = async payload => {
    const { id, formData } = payload;
    // eslint-disable-next-line no-useless-concat
    const requestUrl =
      // eslint-disable-next-line no-useless-concat
      `${urlLink.api.serverUrl}/v1/uploading` + `/img/${id}/payDeposit`;
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
        Authorization: `Bearer ${localStore.get('user').token}`,
      },
    };
    try {
      const response = await axios.post(requestUrl, formData, config);
      if (response.data.data.images) {
        setUrlImgCloud(response.data.data.images.imageUrl);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="user-profile-wrapper">
      <Helmet>
        <title>Pay Deposit</title>
        <meta name="description" content="Description of Pay Deposit" />
      </Helmet>
      {/* Breadcrumb */}
      <Breadcrumb className="">
        <BreadcrumbItem>
          <NavLink to={urlLink.home}>Home</NavLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <NavLink to={urlLink.manageDeposit}>Quản lý cọc</NavLink>
        </BreadcrumbItem>
        <BreadcrumbItem>trả cọc</BreadcrumbItem>
      </Breadcrumb>

      {/* Table */}
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
        content="Xác nhận bạn đã trả cọc cho khách hàng?"
        callBack={() => props.approvePendingPayDeposit(idTransaction, status)}
        toggle={() => {
          props.changeStoreData('showWarningapprove', false);
        }}
      />
      <SuccessPopup
        visible={showSuccessapprove}
        content="Chấp nhận thành công"
        toggle={() => {
          props.changeStoreData('showSuccessapprove', !showSuccessapprove);
        }}
      />
    </div>
  );
}

ManagerPayDepositHost.propTypes = {
  payDepositList: PropTypes.object.isRequired,
  changeStoreData: PropTypes.func.isRequired,
  approvePendingPayDeposit: PropTypes.func.isRequired,
  getPayDepositList: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  payDepositList: makeSelectPayDepositList(),
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

export default compose(withConnect)(ManagerPayDepositHost);
