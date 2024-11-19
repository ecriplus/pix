import Model, { attr } from '@ember-data/model';

export default class AccountInfo extends Model {
  @attr('string') email;
  @attr('string') username;
  @attr('boolean') canSelfDeleteAccount;
}
