import { put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import axios from 'axios';
import { GET_WITHDRAWAL_LIST, PUT_PAY_DEPOSIT_LIST } from './constants';
import { urlLink } from '../../helper/route';
import { getWithdrawalListSuccess, getWithdrawalListFail } from './actions';
import { loadRepos, reposLoaded } from '../App/actions';

export function* apiGetWithdrawalListHost(payload) {
  const requestUrl = `${urlLink.api.serverUrl}${
    urlLink.api.getWithdrawalListHost
  }/${payload.payload.userId}/${payload.payload.motelName}`;
  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl);
    yield put(getWithdrawalListSuccess(response.data.data));
  } catch (error) {
    yield put(getWithdrawalListFail(error.response.data));
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

export function* apiPutPendingPayDepositApprove(payload) {}

export default function* payDepositListSaga() {
  yield takeLatest(GET_WITHDRAWAL_LIST, apiGetWithdrawalListHost);
  yield takeLatest(PUT_PAY_DEPOSIT_LIST, apiPutPendingPayDepositApprove);
}
