/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 *
 * HistoryFloorsRoomHost
 *
 */
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { useHistory, useParams, NavLink } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { getGetMotelRoom } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectHistoryFloorsRoomHost from './selectors';
import './style.scss';
import { urlLink } from '../../helper/route';

export function HistoryFloorsRoomHost(props) {
  useInjectReducer({ key: 'historyFloorsRoomHost', reducer });
  useInjectSaga({ key: 'historyFloorsRoomHost', saga });
  const history = useHistory();
  const { MotelRoom = [] } = props.historyFloorsRoomHost;
  const { id = '' } = useParams();

  useEffect(() => {
    props.getGetMotelRoom(id);
  }, []);

  const columns = [
    {
      field: 'stt',
      headerName: 'STT',
      headerAlign: 'center',
      width: 120,
      align: 'center',
    },
    {
      field: 'roomName',
      headerName: 'Tên phòng',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'key',
      headerName: 'Mã phòng',
      headerAlign: 'center',
      width: 200,
      align: 'center',
      headerClassName: 'header-bold',
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'action-1',
      headerName: 'Chi tiết phòng',
      headerAlign: 'center',
      width: 250,
      align: 'center',
      headerClassName: 'header-bold',
      renderCell: params => (
        <a
          className="btn-detail"
          color="primary"
          onClick={() => {
            history.push(`/room-detail/${params.row._id}`);
          }}
        >
          Chi tiết phòng
        </a>
      ),
    },
    {
      field: 'action-2',
      headerName: 'Lịch Sử Đặt Phòng',
      headerAlign: 'center',
      width: 250,
      align: 'center',
      headerClassName: 'header-bold',
      renderCell: params => (
        <a
          className="btn-detail"
          color="primary"
          onClick={() => {
            history.push(
              `/historyRoomHost/room/${id}/roomdetail/${params.row._id}`,
            );
          }}
        >
          Chi tiết phòng
        </a>
      ),
    },
    {
      field: 'action-3',
      headerName: 'Tạo Hóa Đơn',
      headerAlign: 'center',
      width: 200,
      align: 'center',
      headerClassName: 'header-bold',
      renderCell: params => {
        if (params.row.rentedBy) {
          return (
            <a
              className="btn-detail"
              color="primary"
              onClick={() => {
                history.push(
                  `/exportBillRoom/motel/${id}/room/${params.row._id}/user/${
                    params.row.rentedBy
                  }`,
                );
              }}
            >
              Tạo
            </a>
          );
        }
        return null;
      },
    },
  ];

  return (
    <div className="login-page-wrapper">
      <Helmet>
        <title>Manage Room</title>
        <meta name="description" content="Description of ManageRoom" />
      </Helmet>

      {/* Breadcrumb */}
      <Breadcrumb className="">
        <BreadcrumbItem>
          <NavLink to={urlLink.home}>Home</NavLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <NavLink to={urlLink.historyRoomHost}>Quản lý tòa</NavLink>
        </BreadcrumbItem>
        <BreadcrumbItem>Tòa {id}</BreadcrumbItem>
      </Breadcrumb>

      <div className="title">Quản lý phòng</div>
      <div className="job-list-wrapper container-fluid">
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

HistoryFloorsRoomHost.propTypes = {
  historyFloorsRoomHost: PropTypes.object.isRequired,
  getGetMotelRoom: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  historyFloorsRoomHost: makeSelectHistoryFloorsRoomHost(),
});

function mapDispatchToProps(dispatch) {
  return {
    getGetMotelRoom: id => {
      dispatch(getGetMotelRoom(id));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(HistoryFloorsRoomHost);
