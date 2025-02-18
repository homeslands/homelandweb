/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable default-case */
/*
 *
 * App reducer
 *
 */
import produce from 'immer';
import _ from 'lodash';
import localStorage from 'local-storage';
import {
  SAVE_CURRENT_USER,
  LOAD_REPOS,
  LOAD_REPOS_SUCCESS,
  LOAD_REPOS_ERROR,
  CHANGE_APP_STORE_DATA,
  VALIDATE_TOKEN_SUCCESS,
  VALIDATE_TOKEN_FAIL,
} from './constants';

export const initialState = {
  loading: false,
  error: false,
  currentUser: {},
  showLogout: false,
  showSuccess: false,
  showAlert: false,
  content: '',
  title: '',
  alert: {
    title: '',
    content: '',
    callBack: '',
  },
  isValidToken: localStorage.get('isValidToken') || false,
};

const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case SAVE_CURRENT_USER:
        draft.currentUser = action.user;
        break;
      case LOAD_REPOS:
        draft.loading = true;
        draft.error = false;
        break;
      case LOAD_REPOS_SUCCESS:
        draft.loading = false;
        break;
      case LOAD_REPOS_ERROR:
        draft.loading = false;
        draft.error = true;
        break;
      case VALIDATE_TOKEN_SUCCESS:
        draft.isValidToken = action.response;
        localStorage.set('isValidToken', action.response);
        break;
      case VALIDATE_TOKEN_FAIL:
        draft.error = true;
        break;
      case CHANGE_APP_STORE_DATA:
        if (_.isArray(action.key)) {
          draft.state.setIn(action.key, action.value);
        } else {
          draft[action.key] = action.value;
          break;
        }
    }
  });

export default appReducer;
