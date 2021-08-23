import Route from '@ember/routing/route';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default class LoginOrRegisterToAccessRoute extends Route.extend(UnauthenticatedRouteMixin) {
  model() {
    return this.modelFor('campaigns');
  }
}
