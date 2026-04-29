import PixTabs from '@1024pix/pix-ui/components/pix-tabs';
import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import CourseCard from 'pix-orga/components/catalogue/course-card';
import EmptyState from 'pix-orga/components/ui/empty-state';

export default class List extends Component {
  get filteredItems() {
    const { type } = this.args;

    if (!type || type === 'all') {
      return this.args.courses;
    }
    return this.args.courses.filter((item) => item.type === type);
  }

  <template>
    <div class="catalogue">
      <PixTabs @variant="orga" class="catalogue__nav" @ariaLabel={{t "pages.catalogue.tab-filters.label"}}>
        <LinkTo @route="authenticated.catalogue.list" @model="all">
          {{t "pages.catalogue.tab-filters.all"}}</LinkTo>
        <LinkTo @route="authenticated.catalogue.list" @model="targetProfile">{{t
            "pages.catalogue.tab-filters.target-profiles"
          }}</LinkTo>
        <LinkTo @route="authenticated.catalogue.list" @model="blueprint">{{t
            "pages.catalogue.tab-filters.blueprints"
          }}</LinkTo>
      </PixTabs>

      {{#if this.filteredItems}}
        <div class="catalogue__list">
          {{#each this.filteredItems as |course|}}
            <CourseCard @course={{course}} />
          {{/each}}
        </div>
      {{else}}
        <EmptyState @infoText={{t "pages.catalogue.empty-state"}} />
      {{/if}}
    </div>
  </template>
}
