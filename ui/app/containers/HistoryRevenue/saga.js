/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { GET_HISTORY_REVENUE } from './constants';
import { urlLink } from '../../helper/route';
import { getHistoryRevenueSuccess, getHistoryRevenueFail } from './actions';
import { loadRepos, reposLoaded } from '../App/actions';

export function* apiGetHistoryRevenue({ payload }) {
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.historyRevenue +
    payload}`;
  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl);
    console.log({response})
    yield put(getHistoryRevenueSuccess(response.data.data));
  } catch (error) {
    yield put(getHistoryRevenueFail(error.response));
  } finally {
    yield put(reposLoaded());
  }
}

// Individual exports for testing
export default function* historyRevenueSaga() {
  yield takeLatest(GET_HISTORY_REVENUE, apiGetHistoryRevenue);
}
