import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ENV from 'mon-pix/config/environment';

export default class ResultsRoute extends Route {
  @service currentUser;
  @service session;
  @service store;
  @service router;
  @service featureToggles;

  beforeModel(transition) {
    this.session.requireAuthenticationAndApprovedTermsOfService(transition);
  }

  async model() {
    let questResults = [];
    const user = this.currentUser.user;
    const { campaignParticipation, campaign } = this.modelFor('campaigns.assessment');

    try {
      const campaignParticipationResult = await this.store.queryRecord('campaign-participation-result', {
        campaignId: campaign.id,
        userId: user.id,
      });

      if (!user.isAnonymous) {
        questResults = await this.store.query('quest-result', {
          campaignParticipationId: campaignParticipationResult.id,
        });
      }

      const trainings = await campaignParticipation.hasMany('trainings').reload();

      // Reload the user to display my trainings link on the navbar menu
      if (trainings?.length > 0 && !user.hasRecommendedTrainings) {
        await this.currentUser.load();
      }

      return {
        campaign,
        campaignParticipationResult,
        campaignParticipation,
        showTrainings: false,
        trainings,
        questResults,
      };
    } catch (error) {
      if (error.errors?.[0]?.status === '412') {
        this.router.transitionTo('campaigns.entry-point', campaign.code);
      } else throw error;
    }
  }

  async afterModel(model) {
    if (!this.featureToggles.featureToggles?.isAutoShareEnabled) {
      return;
    }
    if (model.campaignParticipationResult.isShared) {
      return;
    }
    const disabledOrganizationIds = ENV.APP.AUTO_SHARE_DISABLED_ORGANIZATION_IDS.map(Number);
    if (
      model.campaignParticipation.createdAt <= new Date(ENV.APP.AUTO_SHARE_AFTER_DATE) ||
      disabledOrganizationIds.includes(model.campaign.organizationId)
    ) {
      return;
    }

    await this.store.adapterFor('campaign-participation-result').share(model.campaignParticipationResult.id);
    await model.campaignParticipationResult.reload({
      adapterOptions: { userId: this.currentUser.user.id, campaignId: model.campaign.id },
    });
  }
}
