import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import { urlLink } from '../../helper/route';
import { loadRepos, reposLoaded } from '../App/actions';
import {
  getListReportProblemFail,
  getListReportProblemSuccess,
  postStatusReportProblemSuccess,
  postStatusReportProblemFail,
  getListReportProblem,
} from './actions';
import {
  GET_LIST_REPORT_PROBLEM,
  POST_STATUS_REPORT_PROBLEM,
} from './constants';

export function* apiGetListReportProblem(payload) {
  const { data } = payload;
  let requestUrl = '';
  if (data.isAdmin) {
    requestUrl = `${urlLink.api.serverUrl}${
      urlLink.api.AdminReportProblemAdmin
    }`;
  } else {
    requestUrl = `${urlLink.api.serverUrl}${
      urlLink.api.AdminReportProblemHost
    }`;
  }

  yield put(loadRepos());
  try {
    const response = yield axios.get(requestUrl, {
      params: data,
    });
    yield put(getListReportProblemSuccess(response.data.data.data));
  } catch (error) {
    yield put(getListReportProblemFail(error.response.data));
  } finally {
    yield put(reposLoaded());
  }
}

export function* apiPostStatusReportProblem(payload) {
  const { data } = payload;
  const requestUrl = `${urlLink.api.serverUrl}${urlLink.api.reportProblem +
    '/status/' +
    data.id}`;
  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, data);
    yield put(postStatusReportProblemSuccess(response));
  } catch (error) {
    yield put(postStatusReportProblemFail(error));
  } finally {
    yield put(reposLoaded());
  }
}
// Individual exports for testing
export default function* BillListAdminSaga() {
  yield takeLatest(GET_LIST_REPORT_PROBLEM, apiGetListReportProblem);
  yield takeLatest(POST_STATUS_REPORT_PROBLEM, apiPostStatusReportProblem);
}
