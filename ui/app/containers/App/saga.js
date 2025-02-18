/* eslint-disable no-console */
import axios from 'axios';
import { push } from 'react-router-redux';
import { put, takeLatest } from 'redux-saga/effects';
import { urlLink } from '../../helper/route';
import {
  getLogoutFail,
  getLogoutSuccess,
  loadRepos,
  reposLoaded,
  saveCurrentUser,
  searchAddressesFail,
  searchAddressesSuccess,
  validateTokenFail,
  validateTokenSuccess,
} from './actions';
import { LOGOUT, VALIDATE_TOKEN } from './constants';
import localStorage from 'local-storage';

export function* apiLogout() {
  const requestUrl = urlLink.api.serverUrl + urlLink.api.auth.log_out;
  yield put(loadRepos());
  try {
    yield axios.put(requestUrl);
    // clear header axios
    yield (axios.defaults.headers.common.Authorization = '');
    yield put(getLogoutSuccess());
  } catch (error) {
    yield put(getLogoutFail());
  } finally {
    yield put(saveCurrentUser(''));
    yield window.localStorage.clear();
    yield window.sessionStorage.clear();
    yield put(push(urlLink.home));
    yield put(reposLoaded());
  }
}

export function* apiSearchMotelByAddress({ payload }) {
  const { address } = payload;
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.searchMotelRoomfromAddress +
    address}`;
  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl);
    yield put(searchAddressesSuccess(response.data.data));
  } catch (error) {
    yield put(searchAddressesFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiSearchAddress({ payload }) {
  const { address } = payload;
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.searchMotelRoomfromAddress +
    address}`;
  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl);
    yield put(searchAddressesSuccess(response.data.data));
  } catch (error) {
    yield put(searchAddressesFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiValidateToken({ payload }) {
  // payload: {userId, token}
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.auth.validateToken}`;
  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, payload);
    yield put(validateTokenSuccess(response.data.data));
  } catch (error) {
    yield put(validateTokenFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

// Individual exports for testing
export default function* appSaga() {
  yield takeLatest(LOGOUT, apiLogout);
  yield takeLatest(VALIDATE_TOKEN, apiValidateToken);
  // yield takeLatest(SEARCH_ADDRESSES, apiSearchRoom);
}
