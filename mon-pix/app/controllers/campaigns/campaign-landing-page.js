import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import ENV from 'mon-pix/config/environment';

export default class CampaignLandingPageController extends Controller {
  @service currentDomain;
  @service router;
  @service session;

  get shouldDisplayLocaleSwitcher() {
    return this.isInternationalDomain && this.isUserNotAuthenticated;
  }

  get isAutonomousCourse() {
    return this.model.organizationId === ENV.APP.AUTONOMOUS_COURSES_ORGANIZATION_ID;
  }

  get isInternationalDomain() {
    return !this.currentDomain.isFranceDomain;
  }

  get isUserAuthenticatedByGAR() {
    return this.session.isAuthenticatedByGar;
  }

  get isUserAuthenticatedByPix() {
    return this.session.isAuthenticated;
  }

  get isUserNotAuthenticated() {
    return !this.isUserAuthenticatedByPix && !this.isUserAuthenticatedByGAR;
  }

  @action
  startCampaignParticipation() {
    return this.router.transitionTo('organizations.access', this.model.code);
  }
}
