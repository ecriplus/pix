import Service from '@ember/service';

export default class BaseStorage extends Service {
  collectionName;

  set(id, key, value) {
    const data = _getData(this.collectionName, id);
    data[key] = value;
    _setData(this.collectionName, id, data);
  }

  get(id, key) {
    const data = _getData(this.collectionName, id);
    return data[key];
  }

  clear(id) {
    _setData(this.collectionName, id, {});
  }

  clearAll() {
    sessionStorage.setItem(this.collectionName, JSON.stringify({}));
  }
}

function _getData(collectionName, id) {
  const value = sessionStorage.getItem(collectionName);

  const json = value ? JSON.parse(value) : {};

  return json[id] || {};
}

function _setData(collectionName, id, value) {
  const data = sessionStorage.getItem(collectionName);

  const dataParsed = data ? JSON.parse(data) : {};

  dataParsed[id] = value;
  sessionStorage.setItem(collectionName, JSON.stringify(dataParsed));
}
