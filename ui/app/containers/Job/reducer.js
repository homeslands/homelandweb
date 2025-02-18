/* eslint-disable no-console */
/*
 *
 * Job reducer
 *
 */
import produce from 'immer';
import _ from 'lodash';
import { GET_ROOM_SUCCESS, GET_ROOM_FAIL } from '../RoomDetail/constants';
import {
  GET_BANK_INFO_SUCCESS,
  GET_BANK_INFO_FAIL,
  POST_JOB_FAIL,
  POST_JOB_SUCCESS,
  CHANGE_STORE_DATA,
  PUT_JOB,
  GET_JOB_SUCCESS,
  GET_JOB_FAIL,
} from './constants';
export const initialState = {
  room: {},
  roomErrors: [],
  jobError: '',
  showError: false,
  jobErrorNuber: 0,
  job: {},
  bankInfo: [],
};

/* eslint-disable default-case, no-param-reassign */
const jobReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_BANK_INFO_SUCCESS:
        draft.bankInfo = action.response;
        break;
      case GET_BANK_INFO_FAIL:
        draft.bankInfo = action.error;
        break;
      case GET_ROOM_SUCCESS:
        draft.room = action.response;
        break;
      case PUT_JOB:
        draft.job = action.response;
        break;
      case GET_ROOM_FAIL:
        draft.room = action.error;
        break;
      case POST_JOB_SUCCESS:
        draft.room = action.response;
        draft.jobErrorNuber = 2;
        break;
      case POST_JOB_FAIL:
        if (_.isArray(action.error.errors)) {
          if (action.error.errors > 0) {
            const [jobError] = action.error.errors;
            draft.jobError = jobError;
            draft.showError = true;
            draft.jobErrorNuber = 1;
          }
        }
        break;
      case GET_JOB_SUCCESS:
        if (_.isArray(action.payload)) {
          if (action.payload.length > 0) {
            const [job] = action.payload;
            draft.job = job;
          }
        }
        break;
      case GET_JOB_FAIL:
        draft.job = {};
        break;
      case CHANGE_STORE_DATA:
        draft[action.key] = action.value;
        break;
    }
  });

export default jobReducer;
