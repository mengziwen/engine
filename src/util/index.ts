/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-11-30 09:55:10
 * @LastEditors: bhabgs
 * @LastEditTime: 2020-12-01 09:40:00
 */
import reg from './registered';
import systemInfo from './system.info';

const functions = { reg, ...systemInfo };

export { reg, systemInfo };

export default functions;
