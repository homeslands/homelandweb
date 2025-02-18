/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/*
 *
 * Profile reducer
 *
 */
import produce from 'immer';
import _ from 'lodash';
import moment from 'moment';

import {
  GET_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION_FAIL,
  UPDATE_NOTIFICATION_FAIL,
  UPDATE_NOTIFICATION_SUCCESS,
} from './constants';

export const initialState = {
  error: {},
  notifications: [],
  unreadCount: 0,
};

/* eslint-disable default-case, no-param-reassign */
const profileReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_NOTIFICATION_SUCCESS:
        draft.notifications = draft.notifications.map(notification =>
          notification._id === action.id
            ? { ...notification, isRead: true }
            : notification,
        );
        break;
      case UPDATE_NOTIFICATION_FAIL:
        draft.error = action.error;
        break;
      case GET_NOTIFICATION_SUCCESS:
        if (action.response && _.isArray(action.response)) {
          // Check unread count
          draft.unreadCount = action.response.filter(
            notification => !notification.isRead,
          ).length;

          // Check status
          draft.notifications = action.response.map(element => {
            // default
            element.status = '';
            // Invoice
            if (
              element.type === 'deposit' ||
              element.type === 'afterCheckInCost' ||
              element.type === 'monthly'
            ) {
              if (element.conditionalContentTag) {
                if (element.tag === 'Order') {
                  element.status = element.conditionalContentTag.isCompleted
                    ? 'Hoàn thành'
                    : 'Chưa hoàn thành';
                }
                if (element.tag === 'Transactions') {
                  if (
                    element.conditionalContentTag.status === 'success' ||
                    element.conditionalContentTag.status === 'cancel'
                  )
                    element.status = 'Đã phê duyệt';
                  if (element.conditionalContentTag.status === 'faild')
                    element.status = 'Thất bại';
                  if (element.conditionalContentTag.status === 'waiting')
                    element.status = 'Chưa phê duyệt';
                  else element.status = 'N/A';
                }
              } else {
                element.status = 'N/A';
              }
            }

            // Job
            if (element.type === 'activeJob') {
              if (element.conditionalContentTag) {
                element.status = element.conditionalContentTag.isActived
                  ? 'Đã kích hoạt'
                  : 'Chưa kích hoạt';
              } else {
                element.status = 'N/A';
              }
            }

            // Trả cọc
            if (element.type === 'payDeposit') {
              if (element.conditionalContentTag) {
                element.status =
                  element.conditionalContentTag.status === 'paid'
                    ? 'Đã thanh toán'
                    : 'Chưa thành toán';
              } else {
                element.status = 'N/A';
              }
            }
            // Remind renew contract
            if (element.type === 'remindRenewContract') {
              if (element.conditionalContentTag) {
                const checkInDay = moment(
                  element.conditionalContentTag.checkInTime,
                );
                const { rentalPeriod } = element.conditionalContentTag;
                const checkOutDay = checkInDay
                  .clone()
                  .add(rentalPeriod, 'months')
                  .subtract(1, 'days')
                  .endOf('days');
                const dayEndOfRenew = checkOutDay.clone().subtract(15, 'days');
                if (
                  moment().isSameOrBefore(dayEndOfRenew) &&
                  checkOutDay.clone().diff(moment(), 'months') < 1
                ) {
                  element.status = 'Chưa gia hạn';
                } else if (
                  moment().isSameOrBefore(dayEndOfRenew) &&
                  checkOutDay.clone().diff(moment(), 'months') > 1
                ) {
                  element.status = 'Đã gia hạn';
                }
              } else {
                element.status = 'N/A';
              }
              // } else if (element.conditionalContentTag.isCompleted) {
            } else {
              element.status = 'N/A';
            }
            return element;
          });
        }
        break;
      case GET_NOTIFICATION_FAIL:
        draft.error = action.error;
        break;
    }
  });

export default profileReducer;
