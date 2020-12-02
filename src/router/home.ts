/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-11-30 10:06:44
 * @LastEditors: bhabgs
 * @LastEditTime: 2020-12-02 14:07:33
 */
import { RouteRecordRaw } from 'vue-router';
import index from '@/views/home';
import checkUser from '@/util/checkUser';
import uni from '@/util/stringToUni';

const routerRow: RouteRecordRaw = {
  path: '/',
  async beforeEnter(to, from, next) {
    const res = await checkUser.check(true);
    if (res.type === 'ok') {
      next();
    } else {
      next({
        path: `/login`,
        query: { prevpath: to.path, msg: uni.encodeUnicode(res.msg) },
      });
    }
  },
  component: {
    template: '<RouterView />',
  },
  children: [
    {
      path: '/',
      name: 'index',
      component: index,
    },
  ],
};

export default routerRow;
