/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-11-30 09:27:34
 * @LastEditors: bhabgs
 * @LastEditTime: 2021-02-03 09:54:42
 */
import { createApp } from 'vue';
import { AxiosInstance } from 'axios';
import { reg, systemInfo } from '@/util';
import lay from './views/lay';

const app = createApp(lay);

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

const regOption = {
  platForm: systemInfo.platForm(),
  local: false,
} as REGOPTIONS;

app.use(reg, regOption);

const vm = app.mount('#app');
