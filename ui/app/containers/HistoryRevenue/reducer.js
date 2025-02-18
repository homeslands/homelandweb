/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/*
 *
 * Profile reducer
 *
 */
import produce from 'immer';
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';

import {
  GET_HISTORY_REVENUE_SUCCESS,
  GET_HISTORY_REVENUE_FAIL,
} from './constants';

export const initialState = {
  error: {},
  historyRevenue: [],
};

/* eslint-disable default-case, no-param-reassign */
const historyRevenueReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case GET_HISTORY_REVENUE_SUCCESS:
        draft.historyRevenue = action.response;
        break;
      case GET_HISTORY_REVENUE_FAIL:
        draft.error = action.error;
        break;
    }
  });

export default historyRevenueReducer;
