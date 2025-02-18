/*
 *
 * HistoryRevenue actions
 *
 */

import {
  GET_HISTORY_REVENUE,
  GET_HISTORY_REVENUE_SUCCESS,
  GET_HISTORY_REVENUE_FAIL,
} from './constants';

export function getHistoryRevenue(payload) {
  return {
    type: GET_HISTORY_REVENUE,
    payload,
  };
}

export function getHistoryRevenueSuccess(response) {
  return {
    type: GET_HISTORY_REVENUE_SUCCESS,
    response,
  };
}

export function getHistoryRevenueFail(error) {
  return {
    type: GET_HISTORY_REVENUE_FAIL,
    error,
  };
}