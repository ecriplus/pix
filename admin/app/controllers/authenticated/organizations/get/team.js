import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { debounceTask } from 'ember-lifeline';
import config from 'pix-admin/config/environment';

const DEFAULT_PAGE_NUMBER = 1;

export default class GetTeamController extends Controller {
  queryParams = ['pageNumber', 'pageSize', 'firstName', 'lastName', 'email', 'organizationRole'];
  DEBOUNCE_MS = config.pagination.debounce;

  @tracked pageNumber = DEFAULT_PAGE_NUMBER;
  @tracked pageSize = 10;
  @tracked userEmailToAdd = null;
  @tracked isLoading = false;
  @tracked firstName = null;
  @tracked lastName = null;
  @tracked email = null;
  @tracked organizationRole = null;

  @service accessControl;
  @service pixToast;
  @service store;

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
  selectRoleForSearch(value) {
    this.organizationRole = value;
  }

  async _getUser(email) {
    const emailInLowerCase = email.toLowerCase();
    const matchingUsers = await this.store.query('user', { filter: { email: emailInLowerCase } });
    // GET /users?filter[email] makes an approximative request ("LIKE %email%") and not a strict request
    return matchingUsers.find((user) => user.email === emailInLowerCase);
  }

  @action
  async addOrganizationMembership() {
    const { organization } = this.model;
    const email = this.userEmailToAdd.trim();
    const user = await this._getUser(email);
    if (!user) {
      return this.pixToast.sendErrorNotification({ message: 'Compte inconnu.' });
    }

    if (await organization.hasMember(user.id)) {
      return this.pixToast.sendErrorNotification({ message: 'Compte déjà associé.' });
    }

    try {
      await this.store.createRecord('organization-membership', { organization, user }).save();

      await this.model.organizationMemberships.reload({
        adapterOptions: {
          'page[size]': this.pageSize,
          'page[number]': this.pageNumber,
          'filter[firstName]': this.firstName,
          'filter[lastName]': this.lastName,
          'filter[email]': this.email,
          'filter[organizationRole]': this.organizationRole,
        },
      });

      this.userEmailToAdd = null;
      this.pixToast.sendSuccessNotification({ message: 'Accès attribué avec succès.' });
    } catch {
      this.pixToast.sendErrorNotification({ message: 'Une erreur est survenue.' });
    }
  }

  @action
  onChangeUserEmailToAdd(event) {
    this.userEmailToAdd = event.target.value;
  }
}
