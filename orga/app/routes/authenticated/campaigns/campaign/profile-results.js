import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ProfilesRoute extends Route {
  @service store;
  @service router;

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
    groups: {
      refreshModel: true,
    },
    search: {
      refreshModel: true,
    },
    certificability: {
      refreshModel: true,
    },
    participantExternalId: { refreshModel: true },
  };

  @action
  loading(transition) {
    if (transition.from && transition.from.name === 'authenticated.campaigns.campaign.profile-results') {
      return false;
    }
  }

  beforeModel(transition) {
    const campaignId = transition.to.parent.params.campaign_id;
    const places = this.modelFor('authenticated');

    if (places?.hasReachedMaximumPlacesLimit) {
      this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }
  }

  async model(params) {
    const campaign = this.modelFor('authenticated.campaigns.campaign');
    const profiles = await this.store.query('campaign-profiles-collection-participation-summary', {
      filter: {
        campaignId: campaign.id,
        divisions: params.divisions,
        groups: params.groups,
        search: params.search,
        certificability: params.certificability,
        participantExternalId: params.participantExternalId,
      },
      page: {
        number: params.pageNumber,
        size: params.pageSize,
      },
    });
    return {
      campaign,
      profiles,
    };
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('pageNumber', 1);
      controller.set('pageSize', 50);
      controller.set('divisions', []);
      controller.set('groups', []);
      controller.set('search', null);
      controller.set('certificability', null);
    }
  }
}
