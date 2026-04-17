import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AssessmentResultsRoute extends Route {
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
    badges: {
      refreshModel: true,
    },
    unacquiredBadges: {
      refreshModel: true,
    },
    stages: {
      refreshModel: true,
    },
    search: {
      refreshModel: true,
    },
    participantExternalId: {
      refreshModel: true,
    },
  };

  beforeModel(transition) {
    const campaignId = transition.to.parent.params.campaign_id;
    const places = this.modelFor('authenticated');

    if (places?.hasReachedMaximumPlacesLimit) {
      this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }
  }

  async model(params) {
    const campaign = this.modelFor('authenticated.campaigns.campaign');

    const participations = await this.store.query('campaign-assessment-result-minimal', {
      page: {
        number: params.pageNumber,
        size: params.pageSize,
      },
      filter: {
        divisions: params.divisions,
        groups: params.groups,
        badges: params.badges,
        unacquiredBadges: params.unacquiredBadges,
        stages: params.stages,
        search: params.search,
        participantExternalId: params.participantExternalId,
      },
      campaignId: campaign.id,
    });

    return {
      campaign,
      participations,
    };
  }

  @action
  loading(transition) {
    if (transition.from && transition.from.name === 'authenticated.campaigns.campaign.assessment-results') {
      return false;
    }
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.resetFiltering();
    }
  }
}
