import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class JoinController extends Controller {
  @service featureToggles;
  @service router;

  queryParams = ['code', 'invitationId'];
  code = null;
  invitationId = null;

  get isNewAuthDesignEnabled() {
    return this.featureToggles.featureToggles.usePixOrgaNewAuthDesign;
  }

  get routeQueryParams() {
    return { code: this.code, invitationId: this.invitationId };
  }
}
