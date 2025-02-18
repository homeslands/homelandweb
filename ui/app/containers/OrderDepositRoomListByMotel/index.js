/* eslint-disable arrow-body-style */
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

export function OrderDepositRoomListByMotel(props) {
  useInjectReducer({ key: 'historyFloorsRoomHost', reducer });
  useInjectSaga({ key: 'historyFloorsRoomHost', saga });
  const history = useHistory();
  const { MotelRoom = [] } = props.historyFloorsRoomHost;
  const { idMotel = '', nameMotel = '' } = useParams();
  useEffect(() => {
    props.getGetMotelRoom(idMotel);
  }, []);

  const columns = [
    { field: 'stt', headerName: 'STT', headerAlign: 'center', width: 150 },
    {
      field: 'name',
      headerName: 'Tên Phòng',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'roomName',
      headerName: 'Mã phòng',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'status',
      headerName: 'Trạng Thái',
      headerAlign: 'center',
      width: 200,
      headerClassName: 'header-bold',
    },
    {
      field: 'action',
      headerName: 'Chi Tiết',
      headerAlign: 'center',
      width: 250,
      align: 'center',
      headerClassName: 'header-bold',
      renderCell: params => {
        return (
          <>
            <a
              className="btn-detail"
              color="primary"
              onClick={() => {
                history.push(
                  `/manage-deposit/history-deposit-aftercheckincost/motel/${idMotel}/${nameMotel}/room/${
                    params.row._id
                  }/${params.row.name}`,
                );
              }}
            >
              Lịch sử đặt cọc
            </a>
          </>
        );
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
          <NavLink to={urlLink.manageDeposit}>Quản lý cọc</NavLink>
        </BreadcrumbItem>
        <BreadcrumbItem>Tòa {nameMotel}</BreadcrumbItem>
        <BreadcrumbItem>Danh sách phòng</BreadcrumbItem>
      </Breadcrumb>

      <div className="title">Danh sách phòng tòa {nameMotel}</div>
      {/* Table */}
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

OrderDepositRoomListByMotel.propTypes = {
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

export default compose(withConnect)(OrderDepositRoomListByMotel);
