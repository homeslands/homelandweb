/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { put, takeLatest } from 'redux-saga/effects';
import localStoreService from 'local-storage';
import axios from 'axios';
import { push } from 'react-router-redux';
import { POST_SIGN_IN } from './constants';
import { urlLink } from '../../helper/route';
import { postSignInSuccess, postSignInFail } from './actions';
import {
  loadRepos,
  reposLoaded,
  saveCurrentUser,
  validateToken,
} from '../App/actions';

export function* apiPostSignIn(payload) {
  const { payload: data = {} } = payload;
  const requestUrl = urlLink.api.serverUrl + urlLink.api.auth.sign_in;
  console.log({ requestUrl, data });
  yield put(loadRepos());
  try {
    const response = yield axios.post(requestUrl, data);
    const {
      data: userLogin,
      data: { token },
    } = response.data;
    // --------------------axios setting headers to request API-----------------------------------
    yield (axios.defaults.headers.common.Authorization = `Bearer ${token}`);
    // -------------------------------------------------------------------------------------------
    yield localStoreService.set('token', userLogin.token);
    yield localStoreService.set('role', userLogin.role);
    yield localStoreService.set('user', userLogin);
    yield put(postSignInSuccess(userLogin));
    yield put(saveCurrentUser(userLogin));
    yield put(validateToken({ userId: userLogin._id, token }));
    yield put(push(urlLink.home));
  } catch (error) {
    console.log({ requestUrl, error });
    if (error.response) {
      if (error.response.data) {
        const failureData = error.response.data;
        yield put(postSignInFail(failureData));
      }
      yield put(postSignInFail({}));
    } else {
      const offlineData = {
        data: [],
        error: true,
        errors: [
          { errorCode: 4, errorMessage: 'Error: 500 server internal error' },
        ],
      };
      yield put(postSignInFail(offlineData));
    }
  } finally {
    yield put(reposLoaded());
  }
}
// Individual exports for testing
export default function* loginPageSaga() {
  yield takeLatest(POST_SIGN_IN, apiPostSignIn);
}
