/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-11-30 09:55:10
 * @LastEditors: bhabgs
 * @LastEditTime: 2021-01-16 12:02:28
 */
import reg from './registered';
import systemInfo from './system.info';

const id = (length: number = 9, alias?: string) =>
  `${alias || ''}_${Number(
    Math.random()
      .toString()
      .substr(3, length) + Date.now(),
  ).toString(36)}`;

const functions = { reg, id, ...systemInfo };
export { reg, systemInfo, id };

export default functions;
