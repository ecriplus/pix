import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import formatDate from 'ember-intl/helpers/format-date';

import RequirementTag from '../common/combined-courses/requirement-tag';

export default class CombineCourseBluePrintList extends Component {
  @service pixToast;
  @service intl;
  @service currentUser;

  @action
  downloadCSV(blueprint) {
    try {
      const jsonParsed = JSON.stringify({
        name: blueprint.name,
        description: blueprint.description,
        illustration: blueprint.illustration,
        content: blueprint.content,
      });
      const exportedData = [
        ['Identifiant des organisations*', 'Identifiant du createur des campagnes*', 'Json configuration for quest*'],
        ['', this.currentUser.adminMember.id, jsonParsed],
      ];

      const csvContent = exportedData
        .map((line) => line.map((data) => `"${data.replaceAll('"', '""').replaceAll('\\""', '\\"')}"`).join(';'))
        .join('\n');

      const exportLink = document.createElement('a');
      exportLink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
      exportLink.setAttribute('download', `${blueprint.name}.csv`);
      exportLink.click();

      this.pixToast.sendSuccessNotification({
        message: this.intl.t('components.combined-course-blueprints.create.notifications.success'),
      });
    } catch {
      this.pixToast.sendErrorNotification({
        message: this.intl.t('components.combined-course-blueprints.create.notifications.error'),
      });
    }
  }

  <template>
    {{#if @summaries}}
      <PixTable
        @variant="admin"
        @data={{@summaries}}
        @caption={{t "components.combined-course-blueprints.list.table.caption"}}
        class="table"
      >
        <:columns as |blueprint context|>
          <PixTableColumn @context={{context}} class="combinedCourseBlueprint__column--compact">
            <:header>
              {{t "common.fields.id"}}
            </:header>
            <:cell>
              {{blueprint.id}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "common.fields.internalName"}}
            </:header>
            <:cell>
              {{blueprint.internalName}}
              <details>
                <summary>{{t "components.combined-course-blueprints.list.content"}}</summary>
                {{#each blueprint.content as |requirement|}}
                  <RequirementTag @type={{requirement.type}} @value={{requirement.value}} />
                {{/each}}
              </details>
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}} class="combinedCourseBlueprint__column--compact">
            <:header>
              {{t "common.fields.createdAt"}}
            </:header>
            <:cell>
              {{formatDate blueprint.createdAt}}
            </:cell>
          </PixTableColumn>

          <PixTableColumn @context={{context}} class="combinedCourseBlueprint__column--compact">
            <:header>
              {{t "common.fields.actions"}}
            </:header>
            <:cell>
              <PixIconButton
                @ariaLabel={{t "components.combined-course-blueprints.list.downloadButton"}}
                @iconName="download"
                @size="small"
                @triggerAction={{fn this.downloadCSV blueprint}}
              />
            </:cell>
          </PixTableColumn>
        </:columns>
      </PixTable>
    {{else}}
      <div class="table__empty">{{t "common.tables.empty-result"}}</div>
    {{/if}}
  </template>
}
