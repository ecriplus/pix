import Model, { attr } from '@ember-data/model';

export default class AuthenticationMethod extends Model {
  // eslint-disable-next-line ember/no-empty-attrs
  @attr() identityProvider;
}
