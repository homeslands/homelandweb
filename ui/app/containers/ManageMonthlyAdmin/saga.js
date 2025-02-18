import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { GET_MOTEL_LIST } from './constants';
import { urlLink } from '../../helper/route';
import {
  getMotelListSuccess,
  getMotelListFail,
  getBuildingRevenueSuccess,
  getBuildingRevenueFail,
} from './actions';
import { loadRepos, reposLoaded } from '../App/actions';

export function* apiGetMotelList(payload) {
  const { id } = payload;
  const requestUrl =
    urlLink.api.serverUrl + urlLink.api.getRoomListAdminByOwner + id;
  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl);
    yield put(getMotelListSuccess(response.data.data));
  } catch (error) {
    yield put(getMotelListFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export default function* profileSaga() {
  yield takeLatest(GET_MOTEL_LIST, apiGetMotelList);
  // yield takeLatest(GET_BUILDING_REVENUE, apiGetBuildingRevenue);
}
