/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-04-14 09:55:34
 * @LastEditors: bhabgs
 * @LastEditTime: 2021-01-16 12:04:21
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
    '//cdn.jsdelivr.net/npm/vue@3.0.0/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js',
  ],
};

const isProd = process.env.NODE_ENV === 'production';

const conf = {
  isProd,
  title: '3.0模板',
  library: 'micro-template',
  publicPath: 'micro-template',
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
    if (isProd) {
      args[0] = Object.assign(args[0], { cdn: assetsCDN });
    }
    return args;
  });
};

exports.default = {
  library: conf.library,
  publicPath: conf.publicPath,
  chainWebpack,
  externals: isProd ? assetsCDN.externals : {},
};
