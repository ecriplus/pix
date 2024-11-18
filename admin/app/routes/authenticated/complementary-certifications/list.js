import Route from '@ember/routing/route';
import { service } from '@ember/service';
import isEmpty from 'lodash/isEmpty';

export default class ListRoute extends Route {
  @service store;
  @service pixToast;

  async model() {
    try {
      return await this.store.findAll('complementary-certification');
    } catch (errorResponse) {
      if (!isEmpty(errorResponse)) {
        errorResponse.errors.forEach((error) => this.pixToast.sendErrorNotification({ message: error.detail }));
      } else {
        this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
      }
    }
    return [];
  }
}
