import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the profile state domain
 */

const selectEnergyMotelDomain = state => {
  if (state.energyMotel) return state.energyMotel.energyMotel;
  return initialState.energyMotel;
};

/**
 * Other specific selectors
 */

/**
 * Default selector used by Profile
 */

const makeSelectEnergyMotel = () =>
  createSelector(
    selectEnergyMotelDomain,
    substate => substate,
  );

export default makeSelectEnergyMotel;
export { selectEnergyMotelDomain };
