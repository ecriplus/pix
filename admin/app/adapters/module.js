import ApplicationAdapter from './application';

export default class Module extends ApplicationAdapter {
  urlForFindRecord(id) {
    return `${this.host}/${this.namespace}/modules/v2/${id}`;
  }
}
