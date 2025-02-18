import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { GET_MOTEL_LIST, DELETE_MOTEL } from './constants';
import { urlLink } from '../../helper/route';
import {
  getMotelListSuccess,
  getMotelListFail,
  getBuildingRevenueSuccess,
  getBuildingRevenueFail,
  deleteMotelSuccess,
  deleteMotelFail,
  getMotelList,
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

export function* apiDeleteMotel(payload) {
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.deleteMotelByAdmin}${payload.id}`;
  yield put(loadRepos());
  try {
    const response = yield axios.delete(requestUrl);
    yield put(deleteMotelSuccess(response.data.data));
    yield put(getMotelList(payload.idHost));
  } catch (error) {
    yield put(deleteMotelFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export default function* profileSaga() {
  yield takeLatest(GET_MOTEL_LIST, apiGetMotelList);
  yield takeLatest(DELETE_MOTEL, apiDeleteMotel);
  // yield takeLatest(GET_BUILDING_REVENUE, apiGetBuildingRevenue);
}
