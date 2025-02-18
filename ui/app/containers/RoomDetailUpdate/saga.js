/* eslint-disable no-plusplus */
/* eslint-disable no-console */
import { put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import axios from 'axios';
import { push } from 'react-router-redux';
import { saveAs } from 'file-saver';
import _ from 'lodash';

import {
  POST_MOTEL,
  GET_ROOM,
  PUT_ROOM_DETAIL_UPDATE,
  ADD_METER,
  POST_IMAGE,
  POST_QUICK_DEPOSIT,
  POST_QUICK_RENT,
  UPDATE_ROOM_STATUS,
  POST_UPLOAD_QUICK_DEPOSIT,
  POST_UPLOAD_QUICK_RENT,
} from './constants';
import { urlLink } from '../../helper/route';
import {
  postMotelSuccess,
  postMotelFail,
  putRoomDetailUpdateSuccess,
  putRoomDetailUpdateFail,
  putMeterSuccess,
  putMeterFail,
  postImageSuccess,
  postImageFail,
  getRoom,
  postQuickDepositSuccess,
  postQuickDepositFail,
  postQuickRentSuccess,
  postQuickRentFail,
  updateRoomStatusSuccess,
  updateRoomStatusFail,
} from './actions';
import { loadRepos, reposLoaded } from '../App/actions';
import { getRoomFail, getRoomSuccess } from '../RoomDetail/actions';

// Individual exports for testing
export function* apiPostMotel(payload) {
  const requestUrl = urlLink.api.serverUrl + urlLink.api.roomDetail;
  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, payload.payload);
    yield put(postMotelSuccess(response.data.data));
  } catch (error) {
    yield put(postMotelFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPostQuickDeposit({ payload }) {
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.roomDetail}/quickDepositByAdmin`;
  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, payload);
    yield put(postQuickDepositSuccess(response.data.data));
    toast.success('Đặt cọc nhanh thành công');
    yield put(getRoom(payload.roomId));
  } catch (error) {
    const { errors } = error.response.data;
    if (errors && errors.length > 0) {
      toast.error(errors[0].errorMessage);
    }
    yield put(postQuickDepositFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiUploadQuickDeposit({ payload }) {
  console.log({ payload });
  const { file, bankId } = payload;
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.roomDetail}/quickDepositManyRoomsByAdmin`;
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
    responseType: 'blob',
  };
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bankId', bankId);

  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, formData, config);
    console.log({ response });
    toast.success('Đặt cọc hàng loạt thành công');
  } catch (error) {
    toast.error('Đặt cọc hàng loạt thất bại. Vui lòng xem file lỗi trả về');
    console.log({ error });
    if (!_.isEmpty(error.response)) {
      const { data } = error.response;
      saveAs(data, 'validation-errors.xlsx');
    }
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiUploadQuickRent({ payload }) {
  const { file, bankId } = payload;
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.roomDetail}/quickRentManyRoomsByAdmin`;
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
    responseType: 'blob',
  };
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bankId', bankId);

  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, formData, config);
    console.log({ response });
    toast.success('Thuê hàng loạt thành công');
  } catch (error) {
    toast.error('Thuê hàng loạt thất bại. Vui lòng xem file lỗi trả về');
    console.log({ error });
    if (!_.isEmpty(error.response)) {
      const { data } = error.response;
      saveAs(data, 'validation-errors.xlsx');
    }
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPostQuickRent({ payload }) {
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.roomDetail}/quickRentByAdmin`;
  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, payload);
    yield put(postQuickRentSuccess(response.data.data));
    toast.success('Thuê nhanh thành công');
    yield put(getRoom(payload.roomId));
  } catch (error) {
    const { errors } = error.response.data;
    if (errors && errors.length > 0) {
      toast.error(errors[0].errorMessage);
    }
    yield put(postQuickRentFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiGetRoom(payload) {
  const { id } = payload;
  const requestUrl = urlLink.api.serverUrl + urlLink.api.roomDetail + id;
  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl);
    yield put(getRoomSuccess(response.data.data));
  } catch (error) {
    yield put(getRoomFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPutMeter(payload) {
  const { id } = payload.payload;
  const data = payload.payload;
  const requestUrl = urlLink.api.serverUrl + urlLink.api.addIdMetterElectric;
  yield put(loadRepos());
  try {
    const response = yield axios.put(requestUrl, data);
    yield put(putMeterSuccess(response.data.data));
    toast.success('Thêm ID đồng hồ thành công');
    yield put(push(`/room-detail/${id}`));
  } catch (error) {
    yield put(putMeterFail(error.response.data));
    toast.error(error.response.data.errors[0].errorMessage, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
    });
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPostImage({ payload }) {
  // id: RoomId
  const { id, dataFile } = payload;
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.motelDetail}imgs/${id}`;
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  const formData = new FormData();
  formData.append('file', dataFile);

  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, formData, config);
    yield put(postImageSuccess(response.data.data));
    toast.success('Thêm hình thành công');
    yield put(getRoom(id));
  } catch (error) {
    yield put(postImageFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiUpdateRoomStatus({ payload }) {
  // id: RoomId
  const { id, data } = payload;
  const requestUrl = `${urlLink.api.serverUrl + urlLink.api.editStatus + id}`;
  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, { data });
    yield put(updateRoomStatusSuccess(response));
    toast.success('Thay đổi trạng thái thành công');
    yield put(getRoom(id));
  } catch (error) {
    yield put(updateRoomStatusFail(error));
    toast.success('Thay đổi trạng thái thất bại');
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPutRoomDetailUpdate(payload) {
  const requestUrl = urlLink.api.serverUrl + urlLink.api.updateUtilities;
  let data = {};
  if (payload.payload.arrayUrlImage) {
    data = {
      id: payload.payload.id,
      utilities: payload.payload.utilities,
      name: payload.payload.name,
      idElectricMetter: payload.payload.idElectricMetter,
      electricityPrice: payload.payload.electricityPrice,
      price: payload.payload.price,
      waterPrice: payload.payload.waterPrice,
      minimumMonths: payload.payload.minimumMonths,
      availableDate: payload.payload.availableDate,
      arrayUrlImage: payload.payload.arrayUrlImage,
      arrayRemoveImg: payload.payload.arrayRemoveImg,
      acreage: payload.payload.acreage,
      roomPassword: payload.payload.roomPassword,
      depositPrice: payload.payload.depositPrice,
      wifiPrice: payload.payload.wifiPrice,
      garbagePrice: payload.payload.garbagePrice,
      linkVideo: payload.payload.linkVideo,
      vihicle: payload.payload.vihicle,
      person: payload.payload.person,
      wifiPriceN: payload.payload.wifiPriceN,
      description: payload.payload.description,
    };
  } else {
    data = {
      id: payload.payload.id,
      utilities: payload.payload.utilities,
      name: payload.payload.name,
      idElectricMetter: payload.payload.idElectricMetter,
      electricityPrice: payload.payload.electricityPrice,
      price: payload.payload.price,
      waterPrice: payload.payload.waterPrice,
      minimumMonths: payload.payload.minimumMonths,
      availableDate: payload.payload.availableDate,
      acreage: payload.payload.acreage,
      roomPassword: payload.payload.roomPassword,
      depositPrice: payload.payload.depositPrice,
      wifiPrice: payload.payload.wifiPrice,
      garbagePrice: payload.payload.garbagePrice,
      arrayRemoveImg: payload.payload.arrayRemoveImg,
      vihicle: payload.payload.vihicle,
      person: payload.payload.person,
      linkVideo: payload.payload.linkVideo,
      wifiPriceN: payload.payload.wifiPriceN,
      description: payload.payload.description,
    };
  }

  yield put(loadRepos());
  try {
    const response = yield axios.put(requestUrl, data);
    yield put(putRoomDetailUpdateSuccess(response.data.data));
    toast.success('Cập nhật phòng thành công');
    yield put(getRoom(data.id));
  } catch (error) {
    yield put(putRoomDetailUpdateFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export default function* roomDetailSaga() {
  yield takeLatest(POST_MOTEL, apiPostMotel);
  yield takeLatest(GET_ROOM, apiGetRoom);
  yield takeLatest(PUT_ROOM_DETAIL_UPDATE, apiPutRoomDetailUpdate);
  yield takeLatest(ADD_METER, apiPutMeter);
  yield takeLatest(POST_IMAGE, apiPostImage);
  yield takeLatest(POST_QUICK_DEPOSIT, apiPostQuickDeposit);
  yield takeLatest(POST_QUICK_RENT, apiPostQuickRent);
  yield takeLatest(UPDATE_ROOM_STATUS, apiUpdateRoomStatus);
  yield takeLatest(POST_UPLOAD_QUICK_DEPOSIT, apiUploadQuickDeposit);
  yield takeLatest(POST_UPLOAD_QUICK_RENT, apiUploadQuickRent);
}
