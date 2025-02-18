/* eslint-disable prettier/prettier */
import _ from 'lodash';
import { role } from '../helper/constants';

export function isHost(currentUser) {
  if (!_.isEmpty(currentUser)) {
    if (_.isArray(currentUser.role)) {
      return currentUser.role.includes(role.HOST);
    }
  }
  return false;
}
