import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class New extends Controller {
  @service router;
  @service store;
  @service pixToast;

  @tracked errors;

  @action
  async create(attributes) {
    this.errors = null;

    try {
      this.model.setProperties(attributes);
      await this.model.save({ adapterOptions: { organizationId: this.model.organizationId } });
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Erreur lors de la création du lot de place.' });
      this.errors = this.model.errors;
    }

    if (!this.errors) {
      this.pixToast.sendSuccessNotification({ message: 'Le lot de place est enregistré.' });
      this.router.transitionTo('authenticated.organizations.get.places', this.model.organizationId);
    }
  }

  @action
  cancel() {
    this.router.transitionTo('authenticated.organizations.get.places');
  }
}
