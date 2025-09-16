import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default class UserTestsRoute extends Route {
  @service currentUser;
  @service store;
  @service router;

  async model() {
    const user = this.currentUser.user;
    const queryParams = {
      userId: user.id,
      'filter[states]': ['ONGOING', 'TO_SHARE', 'ENDED', 'DISABLED'],
    };
    const campaignParticipationOverviews = await this.store.query('campaign-participation-overview', queryParams);

    const anonymisedCampaignAssessments = await this.store.findAll('anonymised-campaign-assessment', {
      adapterOptions: { userId: user.id },
    });

    return campaignParticipationOverviews.concat(anonymisedCampaignAssessments);
  }

  redirect(model) {
    if (isEmpty(model)) {
      this.router.replaceWith('');
    }
  }

  @action
  loading() {
    return false;
  }
}
