import Service from '@ember/service';
import { inject as service } from '@ember/service';
import get from 'lodash/get';

export default class Authentication extends Service {
  @service router;
  @service session;

  async handleAnonymousAuthentication(transition) {
    const allowedRoutesForAnonymousAccess = [
      'fill-in-campaign-code',
      'campaigns.assessment.tutorial',
      'campaigns.assessment.start-or-resume',
      'campaigns.campaign-landing-page',
      'campaigns.assessment.skill-review',
      'assessments.challenge',
      'assessments.checkpoint',
    ];
    const isUserAnonymous = get(this.session, 'data.authenticated.authenticator') === 'authenticator:anonymous';
    const isRouteAccessNotAllowedForAnonymousUser = !allowedRoutesForAnonymousAccess.includes(
      get(transition, 'to.name')
    );

    if (isUserAnonymous && isRouteAccessNotAllowedForAnonymousUser) {
      await this.session.invalidate();
      this.router.replaceWith('/campagnes');
    }
  }
}
