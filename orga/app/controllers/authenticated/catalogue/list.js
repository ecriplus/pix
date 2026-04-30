import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CatalogueListController extends Controller {
  queryParams = ['search', 'categories', 'areas', 'competences'];

  @tracked search = '';
  @tracked categories = [];
  @tracked areas = [];
  @tracked competences = [];

  @action
  updateFilter(fieldName, value) {
    this[fieldName] = value;
  }

  @action
  resetFilters() {
    this.search = '';
    this.categories = [];
    this.areas = [];
    this.competences = [];
  }
}
