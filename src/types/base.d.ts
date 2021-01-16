/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-11-30 10:05:16
 * @LastEditors: bhabgs
 * @LastEditTime: 2021-01-16 12:01:41
 */

// 展示平台
type PLATFORM = 'app' | 'pcAdmin' | 'pc' | 'pad' | 'web' | 'all';

type mcLib = 'temperalure' | 'current';

interface baseObject<T = any> {
  [key: string]: T;
}

interface baseDictionary {
  code: string;
  name: string;
  pId?: string;
  disable?: boolean;
}

interface REGOPTIONS {
  platForm: PLATFORM;
  local: boolean;
}

interface TCMCHISTORY {
  dt: number;
  mc: string;
  tc: string;
  v: string;
}
