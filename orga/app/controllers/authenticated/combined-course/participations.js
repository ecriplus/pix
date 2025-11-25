import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ParticipationsController extends Controller {
  queryParams = ['fullName', 'statuses', 'divisions', 'groups'];

  @tracked fullName = '';
  @tracked statuses = [];
  @tracked divisions = [];
  @tracked groups = [];

  get divisionsFilter() {
    if (this.divisions.length > 0) return this.divisions;
    if (this.groups.length > 0) return this.groups;
    return [];
  }

  @action
  triggerFiltering(fieldName, value) {
    this[fieldName] = value;
  }

  @action
  clearFilters() {
    this.fullName = '';
    this.statuses = [];
    this.divisions = [];
    this.groups = [];
  }
}
