function getHref() {
  return window.location.href;
}

function replace(url) {
  window.location.replace(url);
}

const Location = {
  getHref,
  replace,
};

export default Location;
