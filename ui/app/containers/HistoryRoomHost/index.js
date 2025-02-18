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
import { Avatar } from '@material-ui/core';

import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { getGetMotelRoom } from './actions';
import reducer from './reducer';
import saga from './saga';
import makeSelectHistoryRoomHost from './selectors';
import './style.scss';
import { urlLink } from '../../helper/route';

export function HistoryRoomHost(props) {
  useInjectReducer({ key: 'historyRoomHost', reducer });
  useInjectSaga({ key: 'historyRoomHost', saga });
  const history = useHistory();
  const { MotelRoom = [] } = props.historyRoomHost;
  useEffect(() => {
    props.getGetMotelRoom();
  }, []);

  const columns = [
    { field: 'key', headerName: 'STT', headerAlign: 'center', width: 150 },
    {
      field: 'name',
      headerName: 'Tên khu trọ',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
    },
    {
      field: 'images',
      headerName: 'Ảnh khu trọ',
      headerAlign: 'center',
      width: 250,
      headerClassName: 'header-bold',
      renderCell: params =>
        params.row.images.length > 0 ? (
          <a href={params.row.images} target="_blank" rel="noopener noreferrer">
            <Avatar
              style={{ width: '250px' }}
              variant="square"
              alt="Avatar"
              src={params.row.images}
            />
          </a>
        ) : null,
    },
    {
      field: 'address',
      headerName: 'Địa chỉ',
      headerAlign: 'center',
      width: 600,
      headerClassName: 'header-bold',
    },
    {
      field: 'totalRoom',
      headerName: 'Tổng phòng',
      headerAlign: 'center',
      width: 170,
      headerClassName: 'header-bold',
      align: 'center',
    },
    {
      field: 'depositedRoom',
      headerName: 'Đã cọc',
      headerAlign: 'center',
      width: 150,
      headerClassName: 'header-bold',
      align: 'center',
    },
    {
      field: 'rentedRoom',
      headerName: 'Đã thuê',
      headerAlign: 'center',
      width: 150,
      headerClassName: 'header-bold',
      align: 'center',
    },
    {
      field: 'action',
      headerName: 'Quản lý phòng',
      headerAlign: 'center',
      width: 400,
      headerClassName: 'header-bold',
      align: 'center',
      renderCell: params => (
        <a
          className="btn-detail"
          onClick={() => {
            history.push(`/historyRoomHost/room/${params.row._id}`);
          }}
        >
          Xem chi tiết
        </a>
      ),
    },
    {
      field: 'withdraw list',
      headerName: 'Quản lý danh sách yêu cầu rút tiền',
      headerAlign: 'center',
      width: 400,
      headerClassName: 'header-bold',
      align: 'center',
      renderCell: params => (
        // eslint-disable-next-line no-unused-expressions
        <>
          <a
            className="btn-detail"
            onClick={() => {
              history.push(
                `/withdraw-request/list/${params.row.owner._id}/${
                  params.row.name
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

  return (
    <div className="login-page-wrapper">
      <Helmet>
        <title>Manage Motel</title>
        <meta name="description" content="Description of Manage Motel" />
      </Helmet>

      {/* Breadcrumb */}
      <Breadcrumb className="">
        <BreadcrumbItem>
          <NavLink to={urlLink.home}>Home</NavLink>
        </BreadcrumbItem>
        <BreadcrumbItem>Quản lý tòa</BreadcrumbItem>
      </Breadcrumb>

      <div className="title">Quản lý tòa nhà</div>
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

HistoryRoomHost.propTypes = {
  historyRoomHost: PropTypes.object.isRequired,
  getGetMotelRoom: PropTypes.func.isRequired,
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

export default compose(withConnect)(HistoryRoomHost);
