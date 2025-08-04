function getLocationHash() {
  return window.location.hash;
}

function getLocationHost() {
  return window.location.host;
}

function getLocationHostname() {
  return window.location.hostname;
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

const PixWindow = {
  getLocationHash,
  getLocationHost,
  getLocationHostname,
  getLocationHref,
  replace,
  reload,
};

export default PixWindow;
