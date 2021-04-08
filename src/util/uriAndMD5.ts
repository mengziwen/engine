function unCode(str: string) {
  const code = window.atob(str);
  return decodeURI(code);
}
function enCode(str: string) {
  const code = encodeURI(str);
  return window.btoa(code);
}

export default {
  enCode,
  unCode,
};
