import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the profile state domain
 */

const selectHistoryRevenueDomain = state =>
  state.historyRevenue || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Profile
 */

const makeSelectHistoryRevenue = () =>
  createSelector(
    selectHistoryRevenueDomain,
    substate => substate,
  );

export default makeSelectHistoryRevenue;
export { selectHistoryRevenueDomain };
