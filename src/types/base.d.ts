/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-11-30 10:05:16
 * @LastEditors: bhabgs
 * @LastEditTime: 2020-12-01 15:23:16
 */

// 展示平台
type FLATFORM = 'app' | 'pcAdmin' | 'pc';

// 设置vue用户自定义属性
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    flatForm: FLATFORM;
  }
}

export interface baseObject<T = any> {
  [key: string]: T;
}

export interface REGOPTIONS {
  flatForm: FLATFORM;
}
