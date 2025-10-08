import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import EmptyState from 'pix-orga/components/campaign/empty-state';
import ParticipationStatus from 'pix-orga/components/ui/participation-status';

export default class CombinedCourse extends Component {
  @service intl;
  @service locale;
  @service currentUser;

  <template>
    {{#if @participations.length}}
      <PixTable
        @variant="orga"
        @caption={{t "pages.combined-course.table.description"}}
        @data={{@participations}}
        class="table"
      >
        <:columns as |participation context|>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.combined-course.table.column.last-name"}}
            </:header>
            <:cell>
              {{participation.lastName}}
            </:cell>
          </PixTableColumn>

          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.combined-course.table.column.first-name"}}
            </:header>
            <:cell>
              {{participation.firstName}}
            </:cell>
          </PixTableColumn>

          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.combined-course.table.column.status"}}
            </:header>
            <:cell>
              <ParticipationStatus @status={{participation.status}} />
            </:cell>
          </PixTableColumn>
        </:columns>
      </PixTable>
      {{#if @participations.meta}}
        <PixPagination @pagination={{@participations.meta}} @locale={{this.locale.currentLanguage}} />
      {{/if}}
    {{else}}
      <EmptyState />
    {{/if}}
  </template>
}
