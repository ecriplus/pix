import ApplicationAdapter from './application';

export default class Passage extends ApplicationAdapter {
  createRecord(store, type, snapshot) {
    const passageData = this.serialize(snapshot);
    const { moduleVersion, occurredAt, sequenceNumber } = snapshot.adapterOptions;
    passageData.data.attributes = {
      ...passageData.data.attributes,
      'module-version': moduleVersion,
      'occurred-at': occurredAt,
      'sequence-number': sequenceNumber,
    };

    const url = this.buildURL(type.modelName, null, snapshot, 'createRecord');
    return this.ajax(url, 'POST', { data: passageData });
  }

  async terminate({ passageId }) {
    const url = `${this.host}/${this.namespace}/passages/${passageId}/terminate`;
    await this.ajax(url, 'POST');
  }
}
