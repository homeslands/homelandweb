/* eslint-disable no-console */
/*
 *
 * MapsPage reducer
 *
 */
import produce from 'immer';
import _ from 'lodash';
import {
  GET_MOTELS_FAIL,
  GET_MOTELS_SUCCESS,
  SEARCH_ADDRESS_SUCCESS,
  SEARCH_ADDRESS_FAIL,
  SELECT_MOTEL_SUCCESS,
} from './constants';

export const initialState = {
  motels: [],
  location: { lat: 10.856866, lng: 106.763324 }, // Default at Ho Chi Minh City
  formattedAddress: '',
  error: {},
  selectedMotel: {},
};

/* eslint-disable default-case, no-param-reassign */
const mapsPageReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_MOTELS_SUCCESS:
        draft.motels = action.response;
        break;
      case GET_MOTELS_FAIL:
        draft.motels = [];
        break;
      case SEARCH_ADDRESS_SUCCESS:
        console.log({ action });
        console.log(
          !_.isEmpty(action.response) &&
            _.isArray(action.response.results) &&
            action.response.results.length > 0,
        );
        if (
          !_.isEmpty(action.response) &&
          _.isArray(action.response.results) &&
          action.response.results.length > 0
        ) {
          const { results } = action.response;
          draft.formattedAddress = results[0].formatted_address;
          draft.location = results[0].geometry.location;
        }
        break;
      case SEARCH_ADDRESS_FAIL:
        break;
      case SELECT_MOTEL_SUCCESS:
        draft.selectedMotel = action.response;
        break;
    }
  });

export default mapsPageReducer;
