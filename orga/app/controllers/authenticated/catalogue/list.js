import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CatalogueListController extends Controller {
  queryParams = ['search', 'categories'];

  @tracked search = '';
  @tracked categories = [];

  @action
  updateFilter(fieldName, value) {
    this[fieldName] = value;
  }

  resetFilters() {
    this.search = '';
  }
}
