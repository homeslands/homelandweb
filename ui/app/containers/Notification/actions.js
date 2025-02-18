/*
 *
 * Profile actions
 *
 */

import {
  GET_NOTIFICATION,
  GET_NOTIFICATION_SUCCESS,
  GET_NOTIFICATION_FAIL,
  UPDATE_NOTIFICATION,
  UPDATE_NOTIFICATION_SUCCESS,
  UPDATE_NOTIFICATION_FAIL,
} from './constants';

export function getNotification(payload) {
  return {
    type: GET_NOTIFICATION,
    payload,
  };
}

export function getNotificationSuccess(response) {
  return {
    type: GET_NOTIFICATION_SUCCESS,
    response,
  };
}

export function getNotificationFail(error) {
  return {
    type: GET_NOTIFICATION_FAIL,
    error,
  };
}

export function updateNotification(payload) {
  return {
    type: UPDATE_NOTIFICATION,
    payload,
  };
}

export function updateNotificationSuccess(response) {
  return {
    type: UPDATE_NOTIFICATION_SUCCESS,
    response,
  };
}

export function updateNotificationFail(error) {
  return {
    type: UPDATE_NOTIFICATION_FAIL,
    error,
  };
}
