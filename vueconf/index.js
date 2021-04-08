/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-04-14 09:55:34
 * @LastEditors: bhabgs
 * @LastEditTime: 2021-02-03 09:51:42
 */
const packageJson = require('../package.json');

const assetsCDN = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'ant-design-vue': 'antd',
    vuex: 'Vuex',
    axios: 'axios',
    moment: 'moment',
  },
  css: [],
  js: [
    'https://unpkg.com/vue@3.0.4/dist/vue.global.js',
    'https://unpkg.com/vue-router@4.0.1/dist/vue-router.global.js',
    'https://unpkg.com/vuex@3.6.0/dist/vuex.js',
    '//cdn.jsdelivr.net/npm/axios@0.21.0/dist/axios.min.js',
    'https://cdn.jsdelivr.net/npm/moment@2.24.0/min/moment.min.js',
    'https://cdn.jsdelivr.net/npm/ant-design-vue@next/dist/antd.js',
  ],
};

const isIntranet = process.env.INTERNET === 'intranet';

const isProd = process.env.NODE_ENV === 'production';

const conf = {
  isProd,
  title: '数据调试',
  library: 'micro-engine',
  publicPath: '/micro-engine',
};

const chainWebpack = (config) => {
  let cdn = {};
  config.plugin('html').tap((args) => {
    cdn = {
      css: assetsCDN.css,
    };
    args[0] = Object.assign(args[0], {
      title: conf.title,
      cdn,
      version: packageJson.version,
    });
    if (isIntranet) {
      args[0] = Object.assign(args[0], { cdn: assetsCDN });
    }
    return args;
  });
};
exports.default = {
  library: conf.library,
  publicPath: conf.publicPath,
  chainWebpack,
  externals: isIntranet ? assetsCDN.externals : {},
};
