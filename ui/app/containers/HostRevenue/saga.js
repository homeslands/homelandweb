import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { urlLink } from '../../helper/route';
import { loadRepos, reposLoaded } from '../App/actions';
import {
  getHostRevenueFail,
  getHostRevenueSuccess,
  getListRoomFail,
  getListRoomSuccess,
  postWithdrawSuccess,
  postWithdrawFail,
} from './actions';
import { GET_HOST_REVENUE, GET_LIST_ROOM, POST_WITHDRAW } from './constants';
import { toast } from 'react-toastify';

export function* apiGetListRoom(payload) {
  const { data } = payload;
  const revenueRequest = `${urlLink.api.serverUrl}${
    urlLink.api.hostBuildingListForRevenue
  }${data.id}`;
  try {
    const revenueResponse = yield axios.get(revenueRequest);
    yield put(getListRoomSuccess(revenueResponse.data.data));
  } catch (error) {
    yield put(getListRoomFail(error.response.data));
  }
}

export function* apiGetHostRevenue(payload) {
  const { data } = payload;
  const idMotel = data.selectedBuilding;
  // const month = data.selectedMonth;
  const year = data.selectedYear;
  const revenueRequest = `${urlLink.api.serverUrl}${
    urlLink.api.buildingRevenue
  }${idMotel}/${year}`;
  yield put(loadRepos());
  try {
    const revenueResponse = yield axios.get(revenueRequest);
    console.log({revenueResponse})
    yield put(getHostRevenueSuccess(revenueResponse.data.data));
  } catch (error) {
    toast.error(error.response.data.errors[0].errorMessage);
    yield put(getHostRevenueFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPostWithdrawRequest(payload) {
  const { data } = payload;

  const requestUrl =
    urlLink.api.serverUrl + urlLink.api.postRequestWithdrawHost;
  try {
    const response = yield axios.post(requestUrl, data);
    yield put(postWithdrawSuccess(response.data));
    toast.success('Gửi yêu cầu rút tiền thành công');
  } catch (error) {
    yield put(postWithdrawFail(error.response.data));
    toast.error(error.response.data.errors[0].errorMessage);
  }
}
export default function* TransactionLogSaga() {
  yield takeLatest(GET_LIST_ROOM, apiGetListRoom);
  yield takeLatest(GET_HOST_REVENUE, apiGetHostRevenue);
  yield takeLatest(POST_WITHDRAW, apiPostWithdrawRequest);
}
