function getLocationHash() {
  return window.location.hash;
}

function getLocationHostname() {
  return window.location.hostname;
}

function getLocationHref() {
  return window.location.href;
}

function reload() {
  window.location.reload(true);
}

const PixWindow = {
  getLocationHash,
  getLocationHostname,
  getLocationHref,
  reload,
};

export default PixWindow;
