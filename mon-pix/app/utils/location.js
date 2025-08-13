function getLocationHash() {
  return window.location.hash;
}

function getLocationHost() {
  return window.location.host;
}

function getLocationHref() {
  return window.location.href;
}

function replace(url) {
  window.location.replace(url);
}

function reload() {
  window.location.reload(true);
}

function assign(url) {
  window.location.assign(url);
}

const Location = {
  getLocationHash,
  getLocationHost,
  getLocationHref,
  replace,
  reload,
  assign,
};

export default Location;
