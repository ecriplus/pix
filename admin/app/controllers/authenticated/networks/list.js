import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { debounceTask } from 'ember-lifeline';
import config from 'pix-admin/config/environment';

export default class NetworkListController extends Controller {
  queryParams = ['name'];
  DEBOUNCE_MS = config.pagination.debounce;

  @tracked name = null;

  _updateFilter(filters) {
    for (const key of Object.keys(filters)) {
      this[key] = filters[key] || null;
    }
  }

  @action
  triggerFiltering(fieldName, event) {
    debounceTask(this, '_updateFilter', { [fieldName]: event.target.value }, this.DEBOUNCE_MS);
  }
}
