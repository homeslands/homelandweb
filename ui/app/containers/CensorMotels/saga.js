import { put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import axios from 'axios';
import { GET_PAY_DEPOSIT_LIST, PUT_PAY_DEPOSIT_LIST } from './constants';
import { urlLink } from '../../helper/route';
import {
  getPayDepositListSuccess,
  getPayDepositListFail,
  approvePendingPayDepositSuccess,
  approvePendingPayDepositFail,
} from './actions';
import { loadRepos, reposLoaded } from '../App/actions';

export function* apiGetPayDepositList() {
  const requestUrl = urlLink.api.serverUrl + urlLink.api.motelPendingCensorList;
  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl);
    yield put(getPayDepositListSuccess(response.data.data.data));
  } catch (error) {
    yield put(getPayDepositListFail(error.response.data));
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

export function* apiPutPendingPayDepositApprove(payload) {
  const requestUrl =
    urlLink.api.serverUrl + urlLink.api.motelPendingCensorAccept;
  yield put(loadRepos());
  try {
    const response = yield axios.put(requestUrl, payload);
    yield put(approvePendingPayDepositSuccess(response.data));
  } catch (error) {
    yield put(approvePendingPayDepositFail(error));
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

// Individual exports for testing
export default function* payDepositListSaga() {
  yield takeLatest(GET_PAY_DEPOSIT_LIST, apiGetPayDepositList);
  yield takeLatest(PUT_PAY_DEPOSIT_LIST, apiPutPendingPayDepositApprove);
}
