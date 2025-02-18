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

import { Button } from 'reactstrap';
import localStore from 'local-storage';
import { FormattedMessage } from 'react-intl';
import { useInjectReducer } from 'utils/injectReducer';
import { useInjectSaga } from 'utils/injectSaga';
import { DataGrid } from '@mui/x-data-grid';
import { NotificationsActive } from '@material-ui/icons';

import { getNotification, updateNotification } from './actions';
import messages from './messages';
import reducer from './reducer';
import saga from './saga';
import './style.scss';
import 'react-toastify/dist/ReactToastify.css';
import ModalComponent from './modal';
import makeSelectNotification from './selectors';

export function NotificationPage(props) {
  useInjectReducer({ key: 'notificationPage', reducer });
  useInjectSaga({ key: 'notificationPage', saga });

  const currentUser = localStore.get('user') || {};
  const { _id = '' } = currentUser;

  const [isOpenNotificationModal, setIsOpenNotificationModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    if (_id) {
      props.getNotification(_id);
    }
  }, []);
  const { notifications = [] } = props.notificationPage;

  const columns = [
    {
      field: 'createdAt',
      headerName: <FormattedMessage {...messages.time} />,
      width: 200,
    },
    {
      field: 'title',
      headerName: <FormattedMessage {...messages.title} />,
      width: 300,
      editable: true,
    },
    {
      field: 'content',
      headerName: <FormattedMessage {...messages.content} />,
      width: 700,
      editable: true,
    },
    {
      field: 'status',
      headerName: <FormattedMessage {...messages.status} />,
      width: 200,
      editable: true,
    },
  ];

  // Loại bỏ các đối tượng không có _id
  const rows = notifications
    .filter(item => item && item._id)
    .map(item => ({
      id: item._id,
      title: item.title,
      content: item.content,
      createdAt: new Date(item.createdAt).toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }),
      isRead: item.isRead || false,
      link: item.url ? item.url : null,
      status: item.status ? item.status : '',
    }));

  const toggleNotificationModal = () => {
    setIsOpenNotificationModal(!isOpenNotificationModal);
  };

  const handleRowClick = async params => {
    const notification = params.row;
    setSelectedNotification(notification);

    if (!notification.isRead) {
      await props.updateNotification(notification.id);
      props.getNotification(_id);
    }
    setIsOpenNotificationModal(true);
  };

  return (
    <div className="user-notification-wrapper container">
      <Helmet>
        <title>Notification</title>
        <meta name="description" content="Description of Profile" />
      </Helmet>
      <div className="user-notification">
        <div className="notification-container">
          <div className="notification-title">
            <FormattedMessage {...messages.header} />
          </div>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={8}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            autoHeight
            getRowClassName={params => {
              // params.row.isRead ? 'read-notification' : 'unread-notification'
              let className = '';

              if (params.row.isRead) {
                className += ' read-notification';
              }
              if (!params.row.isRead) {
                className += ' unread-notification';
              }
              const statusType = params.row.status;
              if (
                statusType.includes('Đã') ||
                statusType.includes('Hoàn thành')
              ) {
                className += ' status-paid';
              }
              if (statusType.includes('Chưa')) {
                className += ' status-unpaid';
              }
              return className.trim();
            }}
            onRowClick={handleRowClick}
          />
          <ModalComponent
            modal={isOpenNotificationModal}
            toggle={toggleNotificationModal}
            footer={
              <div>
                <Button color="secondary" onClick={toggleNotificationModal}>
                  <FormattedMessage {...messages.Cancel} />
                </Button>
              </div>
            }
          >
            <div>
              {selectedNotification && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <NotificationsActive
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '60px',
                      color: 'rgb(206, 20, 20)',
                    }}
                  />
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'rgb(206, 20, 20)',
                      marginBottom: '20px',
                    }}
                  >
                    {selectedNotification.title}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      fontSize: '19px',
                      color: 'black',
                      marginBottom: '20px',
                    }}
                  >
                    {selectedNotification.content}
                  </div>
                  <div>
                    <strong>Link:</strong>
                    {selectedNotification.link ? (
                      <a href={selectedNotification.link}>Tại đây</a>
                    ) : (
                      'Không có'
                    )}
                  </div>
                </div>
              )}
            </div>
          </ModalComponent>
        </div>
      </div>
    </div>
  );
}

NotificationPage.propTypes = {
  notificationPage: PropTypes.object.isRequired,
  getNotification: PropTypes.func.isRequired,
  updateNotification: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  notificationPage: makeSelectNotification(),
});

function mapDispatchToProps(dispatch) {
  return {
    getNotification: id => {
      dispatch(getNotification(id));
    },
    updateNotification: (id, data) => {
      dispatch(updateNotification(id, data));
    },
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(withConnect)(NotificationPage);
