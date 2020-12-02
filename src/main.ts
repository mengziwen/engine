/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-11-30 09:27:34
 * @LastEditors: bhabgs
 * @LastEditTime: 2020-12-01 14:48:08
 */
import { createApp } from 'vue';
import { reg, systemInfo } from '@/util';
import lay from './views/lay';
import { REGOPTIONS } from './types/base';

const app = createApp(lay);

const regOption = {
  flatForm: systemInfo.isMobile() ? 'app' : 'pc',
} as REGOPTIONS;

app.use(reg, regOption);

app.mount('#app');
