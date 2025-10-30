import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ParticipationsController extends Controller {
  queryParams = ['fullName', 'statuses'];

  @tracked fullName = '';
  @tracked statuses = [];

  @action
  triggerFiltering(fieldName, value) {
    this[fieldName] = value;
  }

  @action
  clearFilters() {
    this.fullName = '';
    this.statuses = [];
  }
}
