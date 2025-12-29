import ApplicationAdapter from './application';

export default class InvigilatorAuthenticationAdapter extends ApplicationAdapter {
  urlForCreateRecord() {
    return `${this.host}/${this.namespace}/sessions/supervise`;
  }
}
