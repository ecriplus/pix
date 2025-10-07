import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class LoginController extends Controller {
  @service currentDomain;
  @service featureToggles;

  get isInternationalDomain() {
    return !this.currentDomain.isFranceDomain;
  }

  get isNewAuthDesignEnabled() {
    return this.featureToggles.featureToggles.usePixOrgaNewAuthDesign;
  }
}
