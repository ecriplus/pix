import ApplicationAdapter from './application';

export default class SessionAdapter extends ApplicationAdapter {

  urlForUpdateRecord(id, modelName, { adapterOptions }) {
    const url = super.urlForUpdateRecord(...arguments);
    if (adapterOptions && adapterOptions.flagResultsAsSentToPrescriber)  {
      delete adapterOptions.flagResultsAsSentToPrescriber;
      return url + '/results-sent-to-prescriber';
    } else if (adapterOptions && adapterOptions.updatePublishedCertifications)  {
      delete adapterOptions.updatePublishedCertifications;
      return url + '/publication';
    }
    return url;
  }

  updateRecord(store, type, snapshot) {
    if (snapshot.adapterOptions.flagResultsAsSentToPrescriber) {
      return this.ajax(this.urlForUpdateRecord(snapshot.id, type.modelName, snapshot), 'PUT');
    } else if (snapshot.adapterOptions.updatePublishedCertifications) {
      const data =  { data: { attributes: { toPublish: snapshot.adapterOptions.toPublish } } };
      return this.ajax(this.urlForUpdateRecord(snapshot.id, type.modelName, snapshot), 'PATCH', { data });
    }

    return super.updateRecord(...arguments);
  }
}
