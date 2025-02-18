// import { take, call, put, select } from 'redux-saga/effects';
import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { push } from 'react-router-redux';
import { PUT_CREATE_ROOM } from './constants';
import { urlLink } from '../../helper/route';
import { putCreateRoomSuccess, putCreateRoomFail } from './actions';
import { loadRepos, reposLoaded } from '../App/actions';

export function* apiputCreateRoom(payload) {
  const requestUrl = urlLink.api.serverUrl + urlLink.api.createRoom;
  const data = {
    idFloors: payload.payload.id,
    utilities: payload.payload.utilities,
    name: payload.payload.name,
    idElectricMetter: payload.payload.idElectricMetter,
    electricityPrice: payload.payload.electricityPrice,
    price: payload.payload.price,
    waterPrice: payload.payload.waterPrice,
    status: payload.payload.status,
    acreage: payload.payload.acreage,
    minimumMonths: payload.payload.minimumMonths,
    availableDate: payload.payload.availableDate,
    arrayUrlImage: payload.payload.arrayUrlImage,
    roomPassword: payload.payload.roomPassword,
    depositPrice: payload.payload.depositPrice,
    wifiPrice: payload.payload.wifiPrice,
    wifiPriceN: payload.payload.wifiPriceN,
    garbagePrice: payload.payload.garbagePrice,
    description: payload.payload.description,
  };
  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, data);
    yield put(putCreateRoomSuccess(response.data.data));
    // eslint-disable-next-line no-underscore-dangle
    yield put(push(`/motel-detail-v2/${response.data.data[0]._id}`));
  } catch (error) {
    yield put(putCreateRoomFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export default function* roomDetailSaga() {
  yield takeLatest(PUT_CREATE_ROOM, apiputCreateRoom);
}
