/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { toast } from 'react-toastify';
import { GET_ROOM } from '../RoomDetail/constants';
import { apiGetRoom } from '../RoomDetail/saga';
import { urlLink } from '../../helper/route';
import { loadRepos, reposLoaded } from '../App/actions';
import {
  postJobFail,
  getBankInfoListSuccess,
  getBankInfoListFail,
  getJobSuccess,
  getJobFail,
  getJob,
  putActiveJobFail,
  putActiveJobSuccess,
  postImageFail,
  postImageSuccess,
  deleteJobSuccess,
  deleteJobFail,
} from './actions';
import {
  GET_BANK_INFO,
  GET_JOB,
  POST_JOB,
  PUT_ACTIVE_JOB,
  POST_IMAGE,
  DELETE_JOB,
} from './constants';
import {
  postPaymentUserFail,
  postPaymentUserSuccess,
} from '../AddMoney/actions';

export function* apiGetJob({ payload }) {
  // id: RoomId
  const { id, isDeleted } = payload;
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.getJobByRoom +
    id}?isDeleted=${isDeleted}`;
  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl);
    yield put(getJobSuccess(response.data.data));
  } catch (error) {
    yield put(getJobFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPostJob(payload) {
  const { formData } = payload;

  const requestUrl = urlLink.api.serverUrl + urlLink.api.job;
  const requestUrlPayWallet = urlLink.api.serverUrl + urlLink.api.pay;
  let response;

  try {
    if (formData.type === 'wallet') {
      response = yield axios.post(requestUrl, formData);
    } else if (formData.type === 'cash') {
      const urlCreateJobAndTransactions =
        urlLink.api.serverUrl +
        urlLink.api.postTransactionsDepositPendingBanking +
        formData.keyPayment;

      yield axios.post(urlCreateJobAndTransactions, formData);
    }

    try {
      if (formData.type === 'wallet') {
        const id = response.data.data.currentOrder._id;
        const payloadOder = {
          orderId: id,
          type: formData.type,
        };
        yield axios.put(requestUrlPayWallet, payloadOder);
        yield put(push('/profile'));
      } else {
        yield put(push('/transaction-banking-cash-log'));
      }
    } catch (error) {
      yield put(postJobFail(error.response.data));
    } finally {
      yield put(reposLoaded());
    }
  } catch (error) {
    yield put(postJobFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiDeleteJob({ payload }) {
  const requestUrl =
    urlLink.api.serverUrl + urlLink.api.adminDeleteJobByRoom + payload;
  yield put(loadRepos());
  try {
    const response = yield axios.delete(requestUrl);
    yield put(deleteJobSuccess(response));
    toast.success('Xóa hợp đồng thành công');
    yield put(getJob({ id: payload, isDeleted: false }));
  } catch (error) {
    yield put(deleteJobFail(error));
    toast.success('Xóa hợp đồng thất bại');
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPostPaymentUser(payload) {
  const data = payload.payload;
  const requestUrl =
    urlLink.api.serverUrl +
    urlLink.api.getTransactionPaymentList +
    data.keyPayment;

  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, data);
    yield put(postPaymentUserSuccess(response.data.data));
    yield put(push(`/transaction/user/list`));
  } catch (error) {
    yield put(postPaymentUserFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiBankInfo() {
  // const requestUrl = urlLink.api.serverUrl + urlLink.api.getBankOwnerRoom + payload.id;
  const requestUrl = urlLink.api.serverUrl + urlLink.api.getBankMasterList;
  try {
    const response = yield axios.get(requestUrl);
    if (response && response.data) {
      yield put(getBankInfoListSuccess(response.data.data));
    } else {
      yield put(getBankInfoListFail('Invalid response format'));
    }
  } catch (error) {
    if (error.response && error.response.data) {
      yield put(getBankInfoListFail(error.response.data));
    } else {
      yield put(getBankInfoListFail('Unknown error occurred'));
    }
  }
}

export function* apiPutActiveJob({ payload }) {
  // id: RoomId
  const { id } = payload;
  const requestUrl = `${urlLink.api.serverUrl + urlLink.api.job}/${id}/active`;
  yield put(loadRepos());
  try {
    const response = yield axios.put(requestUrl);
    yield put(putActiveJobSuccess(response.data.data));
    toast.success('Kích hoạt hợp đồng thành công');
  } catch (error) {
    yield put(putActiveJobFail(error.response.data));
    toast.error('Kích hoạt hợp đồng thất bại');
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPostImage({ payload }) {
  // id: JobId
  const { jobId, frontFile, backFile } = payload;
  const requestUrl = `${urlLink.api.serverUrl +
    urlLink.api.uploading}/imgs/${jobId}/job`;
  const config = {
    headers: {
      'content-type': 'multipart/form-data',
    },
  };
  const formData = new FormData();
  [frontFile, backFile].forEach(item => {
    formData.append('file', item);
  });

  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, formData, config);
    yield put(postImageSuccess(response.data.data));
    toast.success('Thêm hình thành công');
    // yield put(putActiveJob({ id: jobId }));
    yield put(getJob({ id: response.data.data.room, isDeleted: false }));
  } catch (error) {
    yield put(postImageFail(error.response.data));
    toast.success('Thêm hình thất bại');
  } finally {
    yield put(reposLoaded());
  }
}

// Individual exports for testing
export default function* jobSaga() {
  yield takeLatest(GET_ROOM, apiGetRoom);
  yield takeLatest(GET_JOB, apiGetJob);
  yield takeLatest(POST_JOB, apiPostJob);
  yield takeLatest(GET_BANK_INFO, apiBankInfo);
  yield takeLatest(POST_IMAGE, apiPostImage);
  yield takeLatest(PUT_ACTIVE_JOB, apiPutActiveJob);
  yield takeLatest(DELETE_JOB, apiDeleteJob);
}
