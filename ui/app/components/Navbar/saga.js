import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { urlLink } from '../../helper/route';
import {
  loadRepos,
  reposLoaded,
  searchAddressesFail,
  searchAddressesSuccess,
  searchAddressesSuccessNull,
} from './actions';

export function* apiSearchAddress(payload) {
  if (payload.value) {
    const requestUrl =
      urlLink.api.serverUrl +
      urlLink.api.searchMotelRoomfromAddress +
      payload.value;
    yield put(loadRepos());
    try {
      const response = yield axios.get(requestUrl);
      yield put(searchAddressesSuccess(response.data.data));
    } catch (error) {
      yield put(searchAddressesFail(error.response.data));
    } finally {
      yield put(reposLoaded());
    }
  } else {
    yield put(searchAddressesSuccessNull(null));
  }
}

export function* apiGetNotification({ payload }) {
  const { userId } = payload;
  const requestUrl =
    urlLink.api.serverUrl +
    urlLink.api.searchMotelRoomfromAddress +
    payload.value;
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

// Individual exports for testing
export default function* appSaga() {
  // yield takeLatest(LOGOUT, apiLogout);
  // yield takeLatest(SEARCH_ADDRESSES, apiSearchRoom);
}
