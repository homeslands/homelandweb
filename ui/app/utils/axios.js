/* eslint-disable prettier/prettier */
import axios from 'axios';
import localStorage from 'local-storage';

import { urlLink } from '../helper/route';

const http = axios.create({
  baseURL: urlLink.api.serverUrl,
});

http.interceptors.request.use(
  config => {
    const accessToken = localStorage.get('token');
    if (accessToken)
      http.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  error => Promise.reject(error),
);
