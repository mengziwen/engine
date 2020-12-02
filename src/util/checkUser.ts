/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-12-01 16:34:44
 * @LastEditors: bhabgs
 * @LastEditTime: 2020-12-02 14:07:56
 */
import { instance } from '@/util/axios';
import { getAllQuery } from './getQuery';

type type = 'failure' | 'ok';
type netType = 1 | 2;
interface BASECALLDATA {
  type: type;
  data: any;
  msg: string;
}

export default {
  config: {
    netType: 2 as netType,
  },
  // 检查用户信息
  async checkToken(token?: string): Promise<BASECALLDATA> {
    token = token || window.sessionStorage.getItem('token') || '';
    if (!token) return this.baseCallData('failure', null, 'token不存在');
    let res;
    try {
      res = await instance.get(`/auth/oauth/check_token?token=${token}`);
    } catch (error) {
      return this.baseCallData('failure', res, 'token检查失败.');
    }
    return this.baseCallData('ok', res, 'token有效');
  },
  async getTokenByCode(code: string): Promise<BASECALLDATA> {
    let res: any;
    try {
      res = await instance.get(
        `/auth/oauth/getTokenByCode?code=${code}&netType=${this.config.netType}`,
      );
    } catch (error) {
      return this.baseCallData(
        'failure',
        res,
        'token检查失败. 接口请求错误 500+',
      );
    }
    if (res.code === 'M0000') {
      window.sessionStorage.setItem('token', res.data.access_token);
      window.sessionStorage.setItem('rf_token', res.data.refresh_token);
    } else {
      return this.baseCallData(
        'failure',
        res,
        `token检查失败. 接口返回错误 code:${res.code}`,
      );
    }
    return this.baseCallData('ok', res, 'token有效');
  },

  async check(checkCorpId?: boolean): Promise<BASECALLDATA> {
    let res = await this.checkToken();
    const { corpId } = getAllQuery();
    if (res.type === 'failure') {
      const { userCode } = getAllQuery();
      if (!userCode)
        return this.baseCallData('failure', {}, '客户端没有传递userCode');
      res = await this.getTokenByCode(userCode);
    }

    if (!corpId && checkCorpId) {
      return this.baseCallData('failure', {}, '客户端没有传递corpId');
    }
    window.sessionStorage.setItem('corpId', corpId);
    return res;
  },
  baseCallData(type: type, data: any, msg: string): Promise<BASECALLDATA> {
    // Promise.reject
    return Promise.resolve({ type, data, msg });
  },
};
