/*
 * @abstract: JianJie
 * @version: 0.0.1
 * @Author: bhabgs
 * @Date: 2020-12-02 13:43:38
 * @LastEditors: bhabgs
 * @LastEditTime: 2020-12-02 13:45:02
 */
// 转为unicode 编码
function encodeUnicode(str: string) {
  const res = [];
  for (let i = 0; i < str.length; i += 1) {
    res[i] = `00${str.charCodeAt(i).toString(16)}`.slice(-4);
  }
  return `\\u${res.join('\\u')}`;
}

// 解码
function decodeUnicode(str: string) {
  str = str.replace(/\\/g, '%');
  return unescape(str);
}

export default {
  encodeUnicode,
  decodeUnicode,
};
