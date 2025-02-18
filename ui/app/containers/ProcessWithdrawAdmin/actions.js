/*
 *
 * Profile actions
 *
 */

import {
  DEFAULT_ACTION,
  CHANGE_STORE_DATA,
  GET_PENDING_ACCEPT_BANKING_CASH_LIST_SUCCESS,
  GET_PENDING_ACCEPT_BANKING_CASH_LIST_FAIL,
  GET_PENDING_ACCEPT_BANKING_CASH_LIST,
  APPROVE_WITHDRAW_REQUEST,
  APPROVE_WITHDRAW_REQUEST_SUCCESS,
  APPROVE_WITHDRAW_REQUEST_FAIL,
} from './constants';

export function getPendingAcceptBankingCashList(payload) {
  return {
    type: GET_PENDING_ACCEPT_BANKING_CASH_LIST,
    payload,
  };
}

export function getPendingAcceptBankingCashListSuccess(response) {
  return {
    type: GET_PENDING_ACCEPT_BANKING_CASH_LIST_SUCCESS,
    response,
  };
}

export function getPendingAcceptBankingCashListFail(error) {
  return {
    type: GET_PENDING_ACCEPT_BANKING_CASH_LIST_FAIL,
    error,
  };
}

export function approveWithdrawRequest(idTransaction, status, userId) {
  return {
    type: APPROVE_WITHDRAW_REQUEST,
    idTransaction,
    status,
    userId,
  };
}

export function approveWithdrawRequestSuccess(response) {
  return {
    type: APPROVE_WITHDRAW_REQUEST_SUCCESS,
    response,
  };
}
export function approveWithdrawRequestFail(error) {
  return {
    type: APPROVE_WITHDRAW_REQUEST_FAIL,
    error,
  };
}

export function changeStoreData(key, value) {
  return {
    type: CHANGE_STORE_DATA,
    key,
    value,
  };
}

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}
