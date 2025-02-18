/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * HistoryRoomHost
 *
 */
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { useHistory, NavLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { getGetMotelRoom } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectHistoryRoomHost from './selectors';
import './style.scss';
import { urlLink } from '../../helper/route';

export function ManageDeposit(props) {
  useInjectReducer({ key: 'historyRoomHost', reducer });
  useInjectSaga({ key: 'historyRoomHost', saga });
  const history = useHistory();
  const { MotelRoom = [] } = props.historyRoomHost;
  useEffect(() => {
    props.getGetMotelRoom();
  }, []);

  const columns = [
    { field: 'key', headerName: 'STT', headerAlign: 'center', width: 120 },
    {
      field: 'name',
      headerName: 'Tên khu trọ',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      headerAlign: 'center',
      width: 550,
      headerClassName: 'header-bold',
    },
    {
      field: 'phone',
      headerName: 'Số điện thoại',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
    },

    {
      field: 'action-1',
      headerName: 'Quản lý duyệt cọc',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
      renderCell: params => (
        // eslint-disable-next-line no-unused-expressions
        <>
          <a
            className="btn-detail"
            onClick={() => {
              history.push(`/manage-deposit/accept-deposit/${params.row._id}`);
            }}
          >
            Xem chi tiết
          </a>
        </>
      ),
    },
    {
      field: 'action-2',
      headerName: 'Duyệt thanh toán khi nhận phòng',
      headerAlign: 'center',
      width: 350,
      headerClassName: 'header-bold',
      renderCell: params => (
        // eslint-disable-next-line no-unused-expressions
        <>
          <a
            className="btn-detail"
            onClick={() => {
              history.push(
                `/manage-deposit/accept-after-check-in-cost/${params.row._id}`,
              );
            }}
          >
            Xem chi tiết
          </a>
        </>
      ),
    },
    {
      field: 'action-3',
      headerName: 'Hóa đơn chờ thanh toán',
      headerAlign: 'center',
      width: 300,
      headerClassName: 'header-bold',
      renderCell: params => {
        // eslint-disable-next-line no-unused-expressions
        return (
          <>
            <a
              className="btn-detail"
              onClick={() => {
                history.push(
                  `/manage-deposit/order-deposit-pending-payment/${
                    params.row._id
                  }/${params.row.name}`,
                );
              }}
            >
              Xem chi tiết
            </a>
          </>
        );
      },
    },
    {
      field: 'action-5',
      headerName: 'Lịch sử đặt cọc',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
      renderCell: params => (
        // eslint-disable-next-line no-unused-expressions
        <>
          <a
            className="btn-detail"
            onClick={() => {
              history.push(
                `/manage-deposit/history-deposit-aftercheckincost/motel/${
                  params.row._id
                }/${params.row.name}`,
              );
            }}
          >
            Xem chi tiết
          </a>
        </>
      ),
    },
    {
      field: 'action-4',
      headerName: 'Quản lý trả cọc',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
      renderCell: params => (
        // eslint-disable-next-line no-unused-expressions
        <>
          <a
            className="btn-detail"
            onClick={() => {
              history.push(`/manage-deposit/pay-deposit/${params.row._id}`);
            }}
          >
            Xem chi tiết
          </a>
        </>
      ),
    },
  ];

  return (
    <div className="login-page-wrapper">
      <Helmet>
        <title>Manage Deposit</title>
        <meta name="description" content="Description of Manage Deposit" />
      </Helmet>
      <div className="job-list-wrapper container-fluid">
        {/* Breadcrumb */}
        <Breadcrumb className="">
          <BreadcrumbItem>
            <NavLink to={urlLink.home}>Home</NavLink>
          </BreadcrumbItem>
          <BreadcrumbItem>Quản lý cọc</BreadcrumbItem>
        </Breadcrumb>
        <div style={{ width: '100%' }}>
          <DataGrid
            getRowId={row => row.key}
            rows={MotelRoom}
            columns={columns}
            pageSize={10}
            autoHeight
            isCellEditable={params => params.key}
          />
        </div>
      </div>
    </div>
  );
}

ManageDeposit.propTypes = {
  getGetMotelRoom: PropTypes.func,
  historyRoomHost: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  historyRoomHost: makeSelectHistoryRoomHost(),
});

function mapDispatchToProps(dispatch) {
  return {
    getGetMotelRoom: () => {
      dispatch(getGetMotelRoom());
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(ManageDeposit);
