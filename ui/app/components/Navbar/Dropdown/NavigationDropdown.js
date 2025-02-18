/* eslint-disable indent */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import localStorage from 'local-storage';
import { useLocation, useHistory } from 'react-router-dom';
import {
  PermIdentityOutlined,
  PeopleOutline,
  BlurOn,
  LibraryBooksOutlined,
  LocalOfferOutlined,
  RestoreOutlined,
  NotificationImportantOutlined,
  ExitToAppRounded,
  CheckCircleOutline,
  ReceiptOutlined,
} from '@material-ui/icons';

import messages from '../messages';
import { role, roleCode } from '../../../helper/constants';

export const NavigationDropdown = props => {
  const currentUser = localStorage.get('user');
  const location = useLocation();
  const history = useHistory();
  const { pathname } = location;

  return (
    <UncontrolledDropdown nav inNavbar>
      <DropdownToggle nav caret>
        <FormattedMessage {...messages.hi} />{' '}
        <strong>
          {currentUser.lastName} {currentUser.firstName}{' '}
        </strong>
      </DropdownToggle>
      <div className="money-info-box">
        {/* All user role */}
        <DropdownMenu right>
          {/* Money info */}
          <DropdownItem
            className={pathname.includes('/money-information') ? 'active' : ''}
            onClick={() => {
              history.push('/money-information');
            }}
          >
            <PermIdentityOutlined className="icon" />
            <FormattedMessage {...messages.money} />
          </DropdownItem>

          {/* Host role */}
          {currentUser.role.length === roleCode.HOST &&
            currentUser.role.includes(role.HOST) && (
              <>
                <DropdownItem
                  className={
                    pathname.includes('/manager-energy-buildings-host')
                      ? 'active'
                      : ''
                  }
                  onClick={() => {
                    history.push('/manager-energy-buildings-host');
                  }}
                >
                  <BlurOn className="icon" />
                  <FormattedMessage {...messages.energyManager} />
                </DropdownItem>
                <DropdownItem
                  className={
                    pathname.includes('/manage-deposit') ? 'active' : ''
                  }
                  onClick={() => {
                    history.push('/manage-deposit');
                  }}
                >
                  <LocalOfferOutlined className="icon" />
                  <FormattedMessage {...messages.order} />
                </DropdownItem>
                <DropdownItem
                  className={
                    pathname.includes('/manage-monthly-order') ? 'active' : ''
                  }
                  onClick={() => {
                    history.push('/manage-monthly-order');
                  }}
                >
                  <LocalOfferOutlined className="icon" />
                  <FormattedMessage {...messages.manageMonthly} />
                </DropdownItem>
                <DropdownItem
                  className={
                    pathname.includes('/user/hostRevenue') ? 'active' : ''
                  }
                  onClick={() => {
                    history.push(`/user/hostRevenue/${currentUser._id}`);
                  }}
                >
                  <LibraryBooksOutlined className="icon" />
                  <FormattedMessage {...messages.hostRoomRevenue} />
                </DropdownItem>
                <DropdownItem
                  className={
                    pathname.includes('/historyRoomHost') ? 'active' : ''
                  }
                  onClick={() => {
                    history.push('/historyRoomHost');
                  }}
                >
                  <RestoreOutlined className="icon" />
                  <FormattedMessage {...messages.hostRoomHist} />
                </DropdownItem>
                <DropdownItem
                  className={
                    pathname.includes('/admin/report-problem-list')
                      ? 'active'
                      : ''
                  }
                  onClick={() => {
                    history.push('/admin/report-problem-list');
                  }}
                >
                  <NotificationImportantOutlined className="icon" />
                  <FormattedMessage {...messages.reportProblemList} />
                </DropdownItem>
              </>
            )}
          {/* Admin role */}
          {currentUser.role.length === roleCode.ADMIN &&
            currentUser.role.includes(role.ADMIN) && (
              <Fragment>
                <DropdownItem
                  className={pathname.includes('/admin/users') ? 'active' : ''}
                  onClick={() => {
                    history.push('/admin/users');
                  }}
                >
                  <PeopleOutline className="icon" />
                  <FormattedMessage {...messages.user} />
                </DropdownItem>
                <DropdownItem
                  className={
                    pathname.includes('/admin/manager-energy-host')
                      ? 'active'
                      : ''
                  }
                  onClick={() => {
                    history.push('/admin/manager-energy-host');
                  }}
                >
                  <BlurOn className="icon" />
                  <FormattedMessage {...messages.managerHost} />
                </DropdownItem>
                <DropdownItem
                  className={
                    pathname.includes('/admin/hostMotelRoom') ? 'active' : ''
                  }
                  onClick={() => {
                    history.push('/admin/hostMotelRoom');
                  }}
                >
                  <LibraryBooksOutlined className="icon" />
                  <FormattedMessage {...messages.host} />
                </DropdownItem>
                <DropdownItem
                  className={
                    pathname.includes('/admin/report-problem-list')
                      ? 'active'
                      : ''
                  }
                  onClick={() => {
                    history.push('/admin/report-problem-list');
                  }}
                >
                  <NotificationImportantOutlined className="icon" />
                  <FormattedMessage {...messages.reportProblemList} />
                </DropdownItem>
                <DropdownItem
                  className={
                    pathname.includes('/admin/censor-motels') ? 'active' : ''
                  }
                  onClick={() => history.push('/admin/censor-motels/')}
                >
                  <CheckCircleOutline className="icon" />
                  <FormattedMessage {...messages.acceptMotels} />
                </DropdownItem>
                <DropdownItem
                  className={
                    pathname.includes('/admin/censor-hosts') ? 'active' : ''
                  }
                  onClick={() => history.push('/admin/censor-hosts/')}
                >
                  <CheckCircleOutline className="icon" />
                  <FormattedMessage {...messages.acceptHosts} />
                </DropdownItem>
              </Fragment>
            )}
          {/* Customer role */}
          {currentUser.role.length === 1 &&
            currentUser.role.includes('customer') && (
              <>
                {/* Manage room energy */}
                <DropdownItem
                  className={
                    pathname.includes('/manager-energy-rooms-user')
                      ? 'active'
                      : ''
                  }
                  onClick={() => {
                    history.push('/manager-energy-rooms-user');
                  }}
                >
                  <BlurOn className="icon" />
                  <FormattedMessage {...messages.energyRoomsUser} />
                </DropdownItem>
                {/* Report problem */}
                <DropdownItem
                  className={
                    pathname.includes('/report-problem-list') ? 'active' : ''
                  }
                  onClick={() => {
                    history.push('/report-problem-list');
                  }}
                >
                  <NotificationImportantOutlined className="icon" />
                  <FormattedMessage {...messages.reportProblemList} />
                </DropdownItem>
                {/* Transaction */}
                <DropdownItem
                  className={
                    pathname.includes('/transaction-banking-cash-log')
                      ? 'active'
                      : ''
                  }
                  onClick={() => {
                    history.push('/transaction-banking-cash-log');
                  }}
                >
                  <ReceiptOutlined className="icon" />
                  <FormattedMessage {...messages.TransactionBankingCashLog} />
                </DropdownItem>
                {/* Order pending */}
                <DropdownItem
                  className={
                    pathname.includes('/orders-pending-pay-user')
                      ? 'active'
                      : ''
                  }
                  onClick={() => {
                    history.push('/orders-pending-pay-user');
                  }}
                >
                  <ReceiptOutlined className="icon" />
                  <FormattedMessage {...messages.orderPendingPayList} />
                </DropdownItem>
              </>
            )}
          <DropdownItem divider />
          {/* General */}
          {/* Profile */}
          <DropdownItem
            className={pathname.includes('/profile') ? 'active' : ''}
            onClick={() => {
              history.push('/profile');
            }}
          >
            <PermIdentityOutlined className="icon" />
            <FormattedMessage {...messages.infor} />
          </DropdownItem>

          {/* Pay deposit */}
          <DropdownItem
            className={pathname.includes('/pay-deposit-user/') ? 'active' : ''}
            onClick={() => {
              history.push('/pay-deposit-user/');
            }}
          >
            <ReceiptOutlined className="icon" />
            <FormattedMessage {...messages.payDeposits} />
          </DropdownItem>

          <DropdownItem divider />
          {/* Logout */}
          <DropdownItem
            onClick={() => {
              props.changeStoreData('showLogout', true);
            }}
          >
            <ExitToAppRounded className="icon" />
            <FormattedMessage {...messages.logout} />
          </DropdownItem>
        </DropdownMenu>
      </div>
    </UncontrolledDropdown>
  );
};

NavigationDropdown.propTypes = {
  changeStoreData: PropTypes.func.isRequired,
};
