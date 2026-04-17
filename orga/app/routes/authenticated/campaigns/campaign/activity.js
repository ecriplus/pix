import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ActivityRoute extends Route {
  @service store;

  queryParams = {
    pageNumber: {
      refreshModel: true,
    },
    pageSize: {
      refreshModel: true,
    },
    divisions: {
      refreshModel: true,
    },
    status: {
      refreshModel: true,
    },
    groups: {
      refreshModel: true,
    },
    search: {
      refreshModel: true,
    },
    participantExternalId: {
      refreshModel: true,
    },
  };

  async model(params) {
    const campaign = this.modelFor('authenticated.campaigns.campaign');
    const participations = await this.store.query('campaign-participant-activity', {
      campaignId: campaign.id,
      page: {
        number: params.pageNumber,
        size: params.pageSize,
      },
      filter: {
        divisions: params.divisions,
        status: params.status,
        groups: params.groups,
        search: params.search,
        participantExternalId: params.participantExternalId,
      },
    });

    return {
      campaign,
      participations,
    };
  }

  @action
  loading(transition) {
    if (transition.from && transition.from.name === 'authenticated.campaigns.campaign.activity') {
      return false;
    }
    return true;
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.resetFiltering();
    }
  }

  @action
  refreshModel() {
    this.modelFor('authenticated.campaigns.campaign').reload();
  }
}
