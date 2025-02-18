/* eslint-disable no-console */
import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import _ from 'lodash';
import { GET_MOTEL_LIST } from './constants';
import { urlLink } from '../../helper/route';
import { getMotelListSuccess, getMotelListFail } from './actions';
import { loadRepos, reposLoaded } from '../App/actions';

export function* apiGetMotelList(payload) {
  const { id } = payload;

  const requestUrl =
    urlLink.api.serverUrl + urlLink.api.getListMotelByHost + id;
  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl);
    if (_.isEmpty(response.data)) {
      yield put(getMotelListSuccess([]));
    } else {
      yield put(getMotelListSuccess(response.data.data));
    }
  } catch (error) {
    yield put(getMotelListFail(error.response));
  } finally {
    yield put(reposLoaded());
  }
}

// Individual exports for testing
export default function* profileSaga() {
  yield takeLatest(GET_MOTEL_LIST, apiGetMotelList);
}
