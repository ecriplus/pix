import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

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
  };

  beforeModel(transition) {
    const campaignId = transition.to.params.campaign_id;
    const places = this.modelFor('authenticated');

    if (places?.hasReachMaximumPlacesWithThreshold) {
      this.router.replaceWith('authenticated.campaigns.campaign', campaignId);
    }
  }

  async model(params) {
    const campaign = this.modelFor('authenticated.campaigns.campaign');
    return RSVP.hash({
      campaign,
      participations: this.fetchResultMinimalList({ campaignId: campaign.id, ...params }),
    });
  }

  @action
  loading(transition) {
    if (transition.from && transition.from.name === 'authenticated.campaigns.campaign.assessment-results') {
      return false;
    }
  }

  fetchResultMinimalList(params) {
    return this.store.query('campaign-assessment-result-minimal', {
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
      },
      campaignId: params.campaignId,
    });
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.pageNumber = 1;
      controller.pageSize = 50;
      controller.divisions = [];
      controller.groups = [];
      controller.badges = [];
      controller.stages = [];
      controller.unacquiredBadges = [];
      controller.search = null;
    }
  }
}
