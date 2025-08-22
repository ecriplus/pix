import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { debounceTask } from 'ember-lifeline';
import config from 'pix-admin/config/environment';

const DEFAULT_PAGE_NUMBER = 1;

export default class TargetProfileOrganizationsController extends Controller {
  queryParams = ['pageNumber', 'pageSize', 'id', 'name', 'type', 'externalId', 'hideArchived'];
  DEBOUNCE_MS = config.pagination.debounce;
  @service router;
  @service pixToast;
  @service store;

  @tracked pageNumber = DEFAULT_PAGE_NUMBER;
  @tracked pageSize = 10;
  @tracked id = null;
  @tracked hideArchived = false;
  @tracked name = null;
  @tracked type = null;
  @tracked externalId = null;

  optionType = [
    { value: 'PRO', label: 'PRO' },
    { value: 'SCO', label: 'SCO' },
    { value: 'SCO-1D', label: 'SCO-1D' },
    { value: 'SUP', label: 'SUP' },
  ];

  updateFilters(filters) {
    for (const filterKey of Object.keys(filters)) {
      this[filterKey] = filters[filterKey];
    }
    this.pageNumber = DEFAULT_PAGE_NUMBER;
  }

  @action
  triggerFiltering(fieldName, event) {
    debounceTask(this, 'updateFilters', { [fieldName]: event.target.value }, this.DEBOUNCE_MS);
  }

  @action
  goToOrganizationPage(organizationId) {
    this.router.transitionTo('authenticated.organizations.get', organizationId);
  }

  @action
  async detachOrganizations(organizationId) {
    const adapter = this.store.adapterFor('target-profile');

    try {
      const detachedOrganizationIds = await adapter.detachOrganizations(this.model.targetProfile.id, [organizationId]);
      const hasDetachedOrganizations = detachedOrganizationIds.length > 0;

      if (hasDetachedOrganizations) {
        const message = 'Organisation(s) détachée(s) avec succès : ' + detachedOrganizationIds.join(', ');
        await this.pixToast.sendSuccessNotification({ message });
        this.router.transitionTo('authenticated.target-profiles.target-profile.organizations');
      }
    } catch {
      return this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }
  }
}
