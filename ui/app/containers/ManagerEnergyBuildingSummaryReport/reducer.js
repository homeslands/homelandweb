/*
 *
 * Profile reducer
 *
 */
import produce from 'immer';
import {
  GET_MOTEL_LIST_SUCCESS,
  GET_MOTEL_LIST_FAIL,
  CHANGE_STORE_DATA,
  GET_ENERGY_MOTEL_SUCCESS,
  GET_ENERGY_MOTEL_FAIL,
} from './constants';

export const initialState = {
  energyMotel: [],
  error: {},
};

/* eslint-disable default-case, no-param-reassign */
const managerBuildingsHostReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_MOTEL_LIST_SUCCESS:
        draft.motelList = action.response;
        break;
      case GET_MOTEL_LIST_FAIL:
        draft.error = action.error;
        break;
      case GET_ENERGY_MOTEL_SUCCESS:
        draft.energyMotel = action.response;
        break;
      case GET_ENERGY_MOTEL_FAIL:
        draft.error = action.error;
        break;
      case CHANGE_STORE_DATA:
        draft[action.key] = action.value;
        break;
    }
  });

export default managerBuildingsHostReducer;
