import SecuredRouteMixin from 'mon-pix/mixins/secured-route-mixin';
import Route from '@ember/routing/route';

export default class FillInParticipantExternalIdRoute extends Route.extend(SecuredRouteMixin) {

  model() {
    return this.modelFor('campaigns');
  }
}
