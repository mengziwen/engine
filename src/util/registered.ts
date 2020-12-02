/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-11-30 09:53:41
 * @LastEditors: bhabgs
 * @LastEditTime: 2020-12-01 14:42:08
 */
import router from '@/router';
import { App } from 'vue';
import '@/assets/less/index.less';
import { REGOPTIONS } from '@/types/base';
import vueGlobal from './globalProperties';

export default {
  install(app: App, option: REGOPTIONS) {
    const globalProperties = {
      flatForm: option.flatForm,
    };
    // 引入路由
    app.use(router);

    // 全局配置
    app.use(vueGlobal, globalProperties);
    // 平台无关事项

    // 根据平台特性引入相关事项
    if (option.flatForm === 'pc') {
      // 动态倒入 pc端使用的插件仓库
    } else if (option.flatForm === 'app') {
      // 动态倒入app 端使用的插件与仓库
    } else {
      // 其他平台 带扩展
    }
  },
};
