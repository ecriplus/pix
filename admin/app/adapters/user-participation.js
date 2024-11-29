import ApplicationAdapter from './application';

export default class UserParticipations extends ApplicationAdapter {
  namespace = 'api/admin';

  urlForDeleteRecord(id, modelName, snapshot) {
    const baseUrl = this.buildURL();
    return `${baseUrl}/campaign-participations/${snapshot.attr('campaignParticipationId')}`;
  }
}
