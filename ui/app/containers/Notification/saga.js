/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { GET_NOTIFICATION, UPDATE_NOTIFICATION } from './constants';
import { urlLink } from '../../helper/route';
import { getNotificationSuccess, getNotificationFail } from './actions';
import { loadRepos, reposLoaded } from '../App/actions';

export function* apiGetNotification({ payload }) {
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.getNotification +
    payload}`;
  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl);
    yield put(getNotificationSuccess(response.data.data));
  } catch (error) {
    yield put(getNotificationFail(error.response));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiUpdateNotification({ payload }) {
  const requestUrl =
    urlLink.api.serverUrl + urlLink.api.updateNotification + payload;
  yield put(loadRepos());
  try {
    const response = yield axios.put(requestUrl);
    yield put(getNotificationSuccess(response.data.data));
  } catch (error) {
    yield put(getNotificationFail(error.response));
  } finally {
    yield put(reposLoaded());
  }
}

// Individual exports for testing
export default function* notificationSaga() {
  yield takeLatest(GET_NOTIFICATION, apiGetNotification);
  yield takeLatest(UPDATE_NOTIFICATION, apiUpdateNotification);
}
