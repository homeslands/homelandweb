/*
 *
 * Job actions
 *
 */

import {
  DEFAULT_ACTION,
  POST_JOB,
  POST_JOB_SUCCESS,
  POST_JOB_FAIL,
  CHANGE_STORE_DATA,
  GET_BANK_INFO,
  GET_BANK_INFO_SUCCESS,
  GET_BANK_INFO_FAIL,
  GET_JOB,
  GET_JOB_SUCCESS,
  GET_JOB_FAIL,
  PUT_ACTIVE_JOB,
  PUT_ACTIVE_JOB_SUCCESS,
  PUT_ACTIVE_JOB_FAIL,
  POST_IMAGE_SUCCESS,
  POST_IMAGE_FAIL,
  POST_IMAGE,
  DELETE_JOB,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_FAIL,
} from './constants';

export function defaultAction() {
  return {
    type: DEFAULT_ACTION,
  };
}

export function getBankInfo(id) {
  return {
    type: GET_BANK_INFO,
    id,
  };
}

export function getBankInfoListSuccess(response) {
  return {
    type: GET_BANK_INFO_SUCCESS,
    response,
  };
}

export function getBankInfoListFail(error) {
  return {
    type: GET_BANK_INFO_FAIL,
    error,
  };
}

export function postJob(formData) {
  return {
    type: POST_JOB,
    formData,
  };
}

export function postJobSuccess(response) {
  return {
    type: POST_JOB_SUCCESS,
    response,
  };
}

export function postJobFail(error) {
  return {
    type: POST_JOB_FAIL,
    error,
  };
}

export function deleteJob(payload) {
  return {
    type: DELETE_JOB,
    payload,
  };
}

export function deleteJobSuccess(response) {
  return {
    type: DELETE_JOB_SUCCESS,
    response,
  };
}

export function deleteJobFail(error) {
  return {
    type: DELETE_JOB_FAIL,
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

export function getJob(payload) {
  return {
    type: GET_JOB,
    payload,
  };
}

export function getJobSuccess(payload) {
  return {
    type: GET_JOB_SUCCESS,
    payload,
  };
}

export function getJobFail(payload) {
  return {
    type: GET_JOB_FAIL,
    payload,
  };
}

export function putActiveJob(payload) {
  return {
    type: PUT_ACTIVE_JOB,
    payload,
  };
}

export function putActiveJobSuccess(payload) {
  return {
    type: PUT_ACTIVE_JOB_SUCCESS,
    payload,
  };
}

export function putActiveJobFail(payload) {
  return {
    type: PUT_ACTIVE_JOB_FAIL,
    payload,
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
