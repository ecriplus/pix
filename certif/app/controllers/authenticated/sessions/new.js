import Controller from '@ember/controller';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { alias } from '@ember/object/computed';
import { service } from '@ember/service';

export default class SessionsNewController extends Controller {
  @alias('model') session;
  @service intl;

  get pageTitle() {
    return this.intl.t('pages.sessions.new.extra-information');
  }
}
