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

function assign(url) {
  window.location.assign(url);
}

const Location = {
  getLocationHash,
  getLocationHost,
  getLocationHostname,
  getLocationHref,
  replace,
  reload,
  assign,
};

export default Location;
