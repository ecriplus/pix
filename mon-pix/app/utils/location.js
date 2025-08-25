function getHref() {
  return window.location.href;
}

function getOrigin() {
  return window.location.origin;
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
  getHref,
  getOrigin,
  replace,
  reload,
  assign,
};

export default Location;
