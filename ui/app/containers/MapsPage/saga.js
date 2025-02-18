/* eslint-disable no-console */
import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';

import { GET_MOTELS, SEARCH_ADDRESS, SELECT_MOTEL } from './constants';
import { urlLink } from '../../helper/route';
import {
  searchAddressSuccess,
  searchAddressFail,
  getMotelsSuccess,
  getMotelsFail,
  selectMotelSuccess,
} from './actions';
import { loadRepos, reposLoaded } from '../App/actions';

// Individual exports for testing
export function* apiGetMotels(payload) {
  const requestUrl = urlLink.api.serverUrl + urlLink.api.motelList;
  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl);
    yield put(getMotelsSuccess(response.data.data.data));
  } catch (error) {
    yield put(getMotelsFail(error.response));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiSelectMotel({ payload }) {
  yield put(selectMotelSuccess(payload));
}

export function* apiSearchAddress({ payload }) {
  const requestUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${payload}&key=AIzaSyCVwwlv1Q3FKlJUZTV-ab5hknaivIDv87o`;
  yield put(loadRepos());
  try {
    const response = yield call(fetch, requestUrl);
    const data = yield response.json(); // Parse the response to JSON
    yield put(searchAddressSuccess(data));
  } catch (error) {
    yield put(searchAddressFail(error.response));
  } finally {
    yield put(reposLoaded());
  }
}

export default function* mapsPageSaga() {
  yield takeLatest(GET_MOTELS, apiGetMotels);
  yield takeLatest(SEARCH_ADDRESS, apiSearchAddress);
  yield takeLatest(SELECT_MOTEL, apiSelectMotel);
}
