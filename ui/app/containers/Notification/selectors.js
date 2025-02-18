import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the profile state domain
 */

const selectNotificationDomain = state =>
  state.notificationPage || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by Profile
 */

const makeSelectNotification = () =>
  createSelector(
    selectNotificationDomain,
    substate => substate,
  );

export default makeSelectNotification;
export { selectNotificationDomain };
