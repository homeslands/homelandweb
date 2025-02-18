/*
 *
 * MapsPage reducer
 *
 */
import produce from 'immer';
import { GET_LIST_ROOM_FAIL, GET_LIST_ROOM_SUCCESS } from './constants';

export const initialState = {
  notification: [],
};

/* eslint-disable default-case, no-param-reassign */
const navbarReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_LIST_ROOM_SUCCESS:
        draft.listRoom = action.response;
        draft.action1 = 1;
        break;
      case GET_LIST_ROOM_FAIL:
        draft.listRoom = [];
        break;
    }
  });

export default navbarReducer;
