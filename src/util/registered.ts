/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2021-01-16 11:58:53
 * @LastEditors: bhabgs
 * @LastEditTime: 2021-02-03 09:55:57
 */
import router from '@/router';
import { App } from 'vue';
import ant from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@/assets/less/index.less';
import vueGlobal from './globalProperties';

export default {
  async install(app: App, option: REGOPTIONS) {
    const production = process.env.NODE_ENV === 'production';
    const globalProperties = {
      platForm: option.platForm,
      local: !production ? option.local : false,
    };
    // 引入路由
    app.use(router);

    // 引入vuex

    // 全局配置
    app.use(vueGlobal, globalProperties);
    // 平台无关事项

    // 根据平台特性引入相关事项
    if (option.platForm === 'web') {
      // 动态倒入 pc端使用的插件仓库
      app.use(ant);
    } else if (option.platForm === 'app') {
      // 动态倒入app 端使用的插件与仓库
    } else {
      // 其他平台 带扩展
    }
  },
};
