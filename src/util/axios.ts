/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-12-02 09:23:52
 * @LastEditors: bhabgs
 * @LastEditTime: 2021-01-16 12:03:04
 */
import axios from 'axios';

const clientType: PLATFORM = 'app';

const headers: baseObject = {
  'X-Custom-Header': 'foobar',
  clientType,
  'Content-Type': 'application/json;charset=UTF-8',
  corpId: '1214465956475068418',
};

const instance = axios.create({
  baseURL: '/api/', // http://192.168.6.166:18003/webapi
  timeout: 60000,
  validateStatus(status) {
    if (status > 400 && status < 500) {
      // console.error(`请求失败. status:${status}`);
    }
    return status < 500;
  },
  headers,
});

const getToken = (): string => {
  return `Bearer ${sessionStorage.getItem('token')}`;
};

instance.interceptors.request.use(
  (conf) => {
    const corpId = sessionStorage.getItem('corpId');
    conf.headers.Authorization = getToken();
    if (corpId) {
      conf.headers.corpId = corpId;
    }
    return conf;
  },
  (err) => {
    return Promise.reject(err);
  },
);

let status: boolean = false;

instance.interceptors.response.use(
  (res) => {
    const resData = res.data;
    status = resData.code === 'M0000';
    if (status) {
      return Promise.resolve(resData);
    }
    return Promise.resolve(resData);
  },
  (err) => {
    return Promise.reject(err);
  },
);

export { instance };

export default axios;
