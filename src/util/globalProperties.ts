import { App } from 'vue';

/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-12-01 14:33:58
 * @LastEditors: bhabgs
 * @LastEditTime: 2020-12-01 15:22:36
 */
export default {
  install(app: App, options: baseObject) {
    for (const i in options) {
      app.config.globalProperties[i] = options[i];
    }
  },
};
