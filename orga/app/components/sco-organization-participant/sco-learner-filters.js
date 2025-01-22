import { service } from '@ember/service';
import Component from '@glimmer/component';
import ENV from 'pix-orga/config/environment';
export default class ScoLearnerFilters extends Component {
  @service intl;

  get debounceTime() {
    return ENV.pagination.debounce;
  }

  get certificabilityOptions() {
    return [
      {
        value: 'not-available',
        label: this.intl.t('pages.sco-organization-participants.table.column.is-certifiable.not-available'),
      },
      {
        value: 'eligible',
        label: this.intl.t('pages.sco-organization-participants.table.column.is-certifiable.eligible'),
      },
      {
        value: 'non-eligible',
        label: this.intl.t('pages.sco-organization-participants.table.column.is-certifiable.non-eligible'),
      },
    ];
  }

  get isClearFiltersButtonDisabled() {
    return (
      !this.args.searchFilter &&
      this.args.divisionsFilter.length === 0 &&
      this.args.connectionTypeFilter.length === 0 &&
      this.args.certificabilityFilter.length === 0
    );
  }
}
