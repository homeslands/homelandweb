/*
 *
 * MapsPage actions
 *
 */

import {
  DEFAULT_ACTION,
  GET_MOTELS,
  GET_MOTELS_SUCCESS,
  GET_MOTELS_FAIL,
  CHANGE_STORE_DATA,
  SEARCH_ADDRESS,
  SEARCH_ADDRESS_SUCCESS,
  SEARCH_ADDRESS_FAIL,
  SELECT_MOTEL,
  SELECT_MOTEL_SUCCESS,
  SELECT_MOTEL_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getMotels(payload) {
  return {
    type: GET_MOTELS,
    payload,
  };
}

export function getMotelsSuccess(response) {
  return {
    type: GET_MOTELS_SUCCESS,
    response,
  };
}

export function getMotelsFail(error) {
  return {
    type: GET_MOTELS_FAIL,
    error,
  };
}

export function searchAddress(payload) {
  return {
    type: SEARCH_ADDRESS,
    payload,
  };
}

export function searchAddressSuccess(response) {
  return {
    type: SEARCH_ADDRESS_SUCCESS,
    response,
  };
}

export function searchAddressFail(error) {
  return {
    type: SEARCH_ADDRESS_FAIL,
    error,
  };
}

export function selectMotel(payload) {
  return {
    type: SELECT_MOTEL,
    payload,
  };
}

export function selectMotelSuccess(response) {
  return {
    type: SELECT_MOTEL_SUCCESS,
    response,
  };
}

export function selectMotelFail(error) {
  return {
    type: SELECT_MOTEL_FAIL,
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
