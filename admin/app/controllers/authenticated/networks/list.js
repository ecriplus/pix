import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { debounceTask } from 'ember-lifeline';
import config from 'pix-admin/config/environment';

const DEFAULT_PAGE_NUMBER = 1;

export default class NetworkListController extends Controller {
  queryParams = ['pageNumber', 'pageSize', 'name'];
  DEBOUNCE_MS = config.pagination.debounce;

  @tracked pageNumber = DEFAULT_PAGE_NUMBER;
  @tracked pageSize = 10;
  @tracked name = null;

  _updateFilter(filters) {
    for (const key of Object.keys(filters)) {
      this[key] = filters[key] || null;
    }
    this.pageNumber = DEFAULT_PAGE_NUMBER;
  }

  @action
  triggerFiltering(fieldName, event) {
    debounceTask(this, '_updateFilter', { [fieldName]: event.target.value }, this.DEBOUNCE_MS);
  }

  @action
  onResetFilter() {
    this.name = null;
  }
}
