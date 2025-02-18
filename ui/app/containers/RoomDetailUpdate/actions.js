/*
 *
 * CreateMotel actions
 *
 */

import {
  DEFAULT_ACTION,
  POST_MOTEL_SUCCESS,
  POST_MOTEL_FAIL,
  POST_MOTEL,
  CHANGE_STORE_DATA,
  PUT_ROOM_DETAIL_UPDATE,
  PUT_ROOM_DETAIL_UPDATE_SUCCESS,
  PUT_ROOM_DETAIL_UPDATE_FAIL,
  ADD_METER,
  ADD_METER_SUCCESS,
  ADD_METER_FAIL,
  GET_ROOM,
  POST_IMAGE_FAIL,
  POST_IMAGE_SUCCESS,
  POST_IMAGE,
  POST_QUICK_DEPOSIT,
  POST_QUICK_DEPOSIT_FAIL,
  POST_QUICK_DEPOSIT_SUCCESS,
  POST_QUICK_RENT,
  POST_QUICK_RENT_SUCCESS,
  POST_QUICK_RENT_FAIL,
  UPDATE_ROOM_STATUS_SUCCESS,
  UPDATE_ROOM_STATUS_FAIL,
  UPDATE_ROOM_STATUS,
  POST_UPLOAD_QUICK_DEPOSIT,
  POST_UPLOAD_QUICK_DEPOSIT_SUCCESS,
  POST_UPLOAD_QUICK_DEPOSIT_FAIL,
  POST_UPLOAD_QUICK_RENT_FAIL,
  POST_UPLOAD_QUICK_RENT_SUCCESS,
  POST_UPLOAD_QUICK_RENT,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getRoom(id) {
  return {
    type: GET_ROOM,
    id,
  };
}

export function postMotel(payload) {
  return {
    type: POST_MOTEL,
    payload,
  };
}

export function postMotelSuccess(response) {
  return {
    type: POST_MOTEL_SUCCESS,
    response,
  };
}

export function postMotelFail(error) {
  return {
    type: POST_MOTEL_FAIL,
    error,
  };
}

export function putMeter(payload) {
  return {
    type: ADD_METER,
    payload,
  };
}

export function putMeterSuccess(response) {
  return {
    type: ADD_METER_SUCCESS,
    response,
  };
}

export function putMeterFail(error) {
  return {
    type: ADD_METER_FAIL,
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

export function putRoomDetailUpdate(payload) {
  return {
    type: PUT_ROOM_DETAIL_UPDATE,
    payload,
  };
}

export function putRoomDetailUpdateSuccess(response) {
  return {
    type: PUT_ROOM_DETAIL_UPDATE_SUCCESS,
    response,
  };
}

export function putRoomDetailUpdateFail(response) {
  return {
    type: PUT_ROOM_DETAIL_UPDATE_FAIL,
    response,
  };
}

export function postImageSuccess(response) {
  return {
    type: POST_IMAGE_SUCCESS,
    response,
  };
}

export function postImageFail(error) {
  return {
    type: POST_IMAGE_FAIL,
    error,
  };
}

export function postImage(payload) {
  return {
    type: POST_IMAGE,
    payload,
  };
}

export function updateRoomStatusSuccess(response) {
  return {
    type: UPDATE_ROOM_STATUS_SUCCESS,
    response,
  };
}

export function updateRoomStatusFail(error) {
  return {
    type: UPDATE_ROOM_STATUS_FAIL,
    error,
  };
}

export function updateRoomStatus(payload) {
  return {
    type: UPDATE_ROOM_STATUS,
    payload,
  };
}

export function postQuickDepositFail(error) {
  return {
    type: POST_QUICK_DEPOSIT_FAIL,
    error,
  };
}

export function postQuickDepositSuccess(payload) {
  return {
    type: POST_QUICK_DEPOSIT_SUCCESS,
    payload,
  };
}

export function postQuickDeposit(payload) {
  return {
    type: POST_QUICK_DEPOSIT,
    payload,
  };
}

export function postUploadQuickDepositFail(error) {
  return {
    type: POST_UPLOAD_QUICK_DEPOSIT_FAIL,
    error,
  };
}

export function postUploadQuickDepositSuccess(payload) {
  return {
    type: POST_UPLOAD_QUICK_DEPOSIT_SUCCESS,
    payload,
  };
}

export function postUploadQuickDeposit(payload) {
  return {
    type: POST_UPLOAD_QUICK_DEPOSIT,
    payload,
  };
}

export function postUploadQuickRentFail(error) {
  return {
    type: POST_UPLOAD_QUICK_RENT_FAIL,
    error,
  };
}

export function postUploadQuickRentSuccess(payload) {
  return {
    type: POST_UPLOAD_QUICK_RENT_SUCCESS,
    payload,
  };
}

export function postUploadQuickRent(payload) {
  return {
    type: POST_UPLOAD_QUICK_RENT,
    payload,
  };
}

export function postQuickRent(payload) {
  return {
    type: POST_QUICK_RENT,
    payload,
  };
}

export function postQuickRentSuccess(payload) {
  return {
    type: POST_QUICK_RENT_SUCCESS,
    payload,
  };
}

export function postQuickRentFail(payload) {
  return {
    type: POST_QUICK_RENT_FAIL,
    payload,
  };
}
