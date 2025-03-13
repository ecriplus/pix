function getLocationHash() {
  return window.location.hash;
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
  getLocationHostname,
  getLocationHref,
  replace,
  reload,
};

export default PixWindow;
