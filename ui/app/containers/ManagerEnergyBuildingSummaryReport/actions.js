/*
 *
 * Profile actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_MOTEL_LIST,
  GET_MOTEL_LIST_SUCCESS,
  GET_MOTEL_LIST_FAIL,
  CHANGE_STORE_DATA,
  GET_ENERGY_MOTEL,
  GET_ENERGY_MOTEL_SUCCESS,
  GET_ENERGY_MOTEL_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getMotelList() {
  return {
    type: GET_MOTEL_LIST,
  };
}
export function getMotelListSuccess(response) {
  return {
    type: GET_MOTEL_LIST_SUCCESS,
    response,
  };
}
export function getMotelListFail(error) {
  return {
    type: GET_MOTEL_LIST_FAIL,
    error,
  };
}

export function getEnergyMotel(payload) {
  return {
    type: GET_ENERGY_MOTEL,
    payload,
  };
}
export function getEnergyMotelSuccess(response) {
  return {
    type: GET_ENERGY_MOTEL_SUCCESS,
    response,
  };
}
export function getEnergyMotelFail(error) {
  return {
    type: GET_ENERGY_MOTEL_FAIL,
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
