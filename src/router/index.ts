/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-11-30 09:49:13
 * @LastEditors: bhabgs
 * @LastEditTime: 2020-12-02 13:19:07
 */
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import login from '@/components/login';
import home from './home';

const routes: Array<RouteRecordRaw> = [
  home,
  { path: '/login', component: login },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   next();
// });

export default router;
