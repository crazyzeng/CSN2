function cleanEmpty(actual) {
  const arr = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      arr.push(actual[i]);
    }
  }
  return arr;
}

//
export function toQueryString(obj) {
  if (!obj) return "";
  return cleanEmpty(
    Object.keys(obj).map(key => {
      if (obj[key] === undefined) return "";
      return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
    })
  ).join("&");
}
