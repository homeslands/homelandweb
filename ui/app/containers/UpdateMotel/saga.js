import axios from 'axios';
import { push } from 'react-router-redux';
import { put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { urlLink } from '../../helper/route';
import { loadRepos, reposLoaded } from '../App/actions';
import { GET_MOTEL } from '../Motel/constants';
import {
  postImageFail,
  postImageSuccess,
  putMotelFail,
  putMotelSuccess,
} from './actions';
import { POST_IMAGE, PUT_MOTEL } from './constants';
import { apiGetMotel } from '../Motel/saga';
import { getMotel } from '../Motel/actions';

export function* apiPutMotel(payload) {
  const { id, formData } = payload;
  const data = { id, formData };

  const requestUrl = urlLink.api.serverUrl + urlLink.api.motelDetail + id;

  yield put(loadRepos());
  try {
    const response = yield axios.put(requestUrl, data);
    yield put(putMotelSuccess(response.data.data));
    yield put(push(`/motel/${id}`));
  } catch (error) {
    yield put(putMotelFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPostImage({ payload }) {
  // id: MotelId
  const { id, dataFile } = payload;
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.motelDetail}img/${id}`;
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
    yield put(getMotel(id));
  } catch (error) {
    yield put(postImageFail(error.response.data));
    toast.success('Thêm hình thất bại');
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPostImgCall(payload) {
  const { id, formData } = payload;
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.motelDetail}img/${id}`;

  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };

  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, formData, config);
    return response;
  } catch (error) {
    return error.response.data;
  } finally {
    yield put(reposLoaded());
  }
}

// Individual exports for testing
export default function* updateMotelSaga() {
  yield takeLatest(GET_MOTEL, apiGetMotel);
  yield takeLatest(PUT_MOTEL, apiPutMotel);
  yield takeLatest(POST_IMAGE, apiPostImage);
}
