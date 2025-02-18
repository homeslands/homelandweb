/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable prettier/prettier */
/* eslint-disable indent */
/* eslint-disable prettier/prettier */
import React from 'react';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import { NotificationsNoneOutlined } from '@material-ui/icons';
import _ from 'lodash';
import { useHistory, NavLink } from 'react-router-dom';
import { urlLink } from '../../../helper/route';

export const NotificationDropdown = props => {
  const history = useHistory();
  const { notificationState } = props;

  return (
    <UncontrolledDropdown>
      <DropdownToggle nav>
        <div className="navbar__notification">
          <NotificationsNoneOutlined className="navbar__notification-icon" />
          {!_.isEmpty(notificationState) &&
            notificationState.unreadCount > 0 && (
              <div className="navbar__notification-unread-count">
                {notificationState.unreadCount}
              </div>
            )}
        </div>
      </DropdownToggle>
      <DropdownMenu right className="navbar__notification-menu">
        <DropdownItem
          className="navbar__notification-menu-item all"
          onClick={() => history.replace(urlLink.notifications)}
        >
          Xem tất cả
        </DropdownItem>
        {_.isArray(notificationState.notifications) &&
          notificationState.notifications.map(item => {
            return (
              <div
                className="navbar__notification-menu-item"
                key={item.content}
                onClick={() => {
                  if (item.url) {
                    window.location.href = item.url;
                  }
                }}
              >
                <DropdownItem className="navbar__notification-menu-item content">
                  {item.content}
                </DropdownItem>
                <DropdownItem divider />
              </div>
            );
          })}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

NotificationDropdown.propTypes = {
  notificationState: PropTypes.object.isRequired,
};
