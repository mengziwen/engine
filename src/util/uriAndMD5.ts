function unCode(str: string) {
  const code = window.atob(str);
  return decodeURIComponent(code);
}
function enCode(str: string) {
  const code = encodeURIComponent(str);
  return window.btoa(code);
}

export default { enCode, unCode };
