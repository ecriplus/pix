import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ListRoute extends Route {
  queryParams = {
    pageNumber: { refreshModel: true },
    pageSize: { refreshModel: true },
    status: { refreshModel: true },
    sessionId: { refreshModel: true },
  };

  @service currentUser;
  @service store;

  beforeModel() {
    this.currentUser.checkRestrictedAccess();
  }

  async model(params) {
    const sessionSummaries = await this.store.query(
      'session-summary',
      {
        page: {
          number: params.pageNumber,
          size: params.pageSize,
        },
        filter: {
          status: params.status || undefined,
          sessionId: params.sessionId || undefined,
        },
      },
      { reload: true },
    );

    return {
      sessionSummaries,
    };
  }

  resetController(controller, isExiting, transition) {
    if (this._isNotComingFromSessionsDetails(isExiting, transition)) {
      controller.pageNumber = 1;
      controller.pageSize = 25;
      controller.status = null;
      controller.sessionId = null;
    }
  }

  _isNotComingFromSessionsDetails(isExiting, transition) {
    return isExiting && transition.to.parent.name !== 'authenticated.sessions.details';
  }
}
