import ApplicationAdapter from './application';

export default class ScoBlockedAccessDatesAdapter extends ApplicationAdapter {
  namespace = 'api/admin';

  urlForFindAll() {
    return `${this.host}/${this.namespace}/sco-blocked-access-dates`;
  }

  updateRecord(scoOrganizationType, reopeningDate) {
    console.log('hi');
    const url = `${this.host}/${this.namespace}/sco-blocked-access-dates/${scoOrganizationType}`;
    const payload = {
      data: {
        attributes: {
          value: reopeningDate,
        },
      },
    };
    return this.ajax(url, 'PATCH', { data: payload });
  }
}
