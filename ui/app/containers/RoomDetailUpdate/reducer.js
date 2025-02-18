/* eslint-disable no-console */
/*
 *
 * roomDetail reducer
 *
 */
import produce from 'immer';
import {
  POST_MOTEL_SUCCESS,
  POST_MOTEL_FAIL,
  CHANGE_STORE_DATA,
  GET_ROOM_SUCCESS,
  GET_ROOM_FAIL,
  PUT_ROOM_DETAIL_UPDATE_SUCCESS,
  PUT_ROOM_DETAIL_UPDATE_FAIL,
  ADD_METER_SUCCESS,
  ADD_METER_FAIL,
  POST_IMAGE_SUCCESS,
  POST_IMAGE_FAIL,
  POST_QUICK_RENT_SUCCESS,
  UPDATE_ROOM_STATUS_SUCCESS,
  UPDATE_ROOM_STATUS_FAIL,
} from './constants';

export const initialState = {
  showSuccessPopup: false,
  showErrorPopup: false,
  content: '',
  action: 0,
  roomdetailupdate: {},
};

/* eslint-disable default-case, no-param-reassign */
const roomDetailReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case POST_MOTEL_SUCCESS:
        draft.showSuccessPopup = true;
        draft.action = 1;
        break;
      case POST_MOTEL_FAIL:
        draft.showErrorPopup = true;
        draft.action = 2;
        break;
      case ADD_METER_SUCCESS:
        break;
      case ADD_METER_FAIL:
        break;
      case CHANGE_STORE_DATA:
        draft[action.key] = action.value;
        break;
      case GET_ROOM_SUCCESS:
        draft.room = action.response;
        break;
      case GET_ROOM_FAIL:
        draft.room = action.error;
        break;
      case PUT_ROOM_DETAIL_UPDATE_SUCCESS:
        draft.roomdetailupdate = action.response;
        break;
      case PUT_ROOM_DETAIL_UPDATE_FAIL:
        draft.roomdetailupdate = action.error;
        break;
      case POST_QUICK_RENT_SUCCESS:
        break;
      case POST_IMAGE_SUCCESS:
        break;
      case POST_IMAGE_FAIL:
        break;
      case UPDATE_ROOM_STATUS_SUCCESS:
        console.log({ action });
        break;
      case UPDATE_ROOM_STATUS_FAIL:
        break;
    }
  });

export default roomDetailReducer;
