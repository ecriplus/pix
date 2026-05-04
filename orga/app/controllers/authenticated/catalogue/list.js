import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CatalogueListController extends Controller {
  queryParams = ['search', 'category', 'areas', 'competences'];

  @tracked search = '';
  @tracked category = '';
  @tracked areas = [];
  @tracked competences = [];

  @action
  updateFilter(fieldName, value) {
    this[fieldName] = value;
  }

  @action
  resetFilters() {
    this.search = '';
    this.category = '';
    this.areas = [];
    this.competences = [];
  }
}
