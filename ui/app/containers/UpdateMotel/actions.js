/*
 *
 * UpdateMotel actions
 *
 */

import {
  DEFAULT_ACTION,
  PUT_MOTEL,
  PUT_MOTEL_SUCCESS,
  PUT_MOTEL_FAIL,
  CHANGE_STORE_DATA,
  POST_IMAGE_SUCCESS,
  POST_IMAGE_FAIL,
  POST_IMAGE,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function putMotel(id, formData) {
  return {
    type: PUT_MOTEL,
    id,
    formData,
  };
}

export function putMotelSuccess(response) {
  return {
    type: PUT_MOTEL_SUCCESS,
    response,
  };
}

export function putMotelFail(error) {
  return {
    type: PUT_MOTEL_FAIL,
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
