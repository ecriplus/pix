import ApplicationAdapter from './application';

export default class PassageEventsCollection extends ApplicationAdapter {
  urlForCreateRecord() {
    const baseUrl = this.buildURL();
    return `${baseUrl}/passage-events`;
  }
}
