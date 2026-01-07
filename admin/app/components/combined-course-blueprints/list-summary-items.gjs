import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
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
  makeHref(blueprint) {
    const jsonParsed = JSON.stringify({
      name: blueprint.name,
      description: blueprint.description,
      illustration: blueprint.illustration,
    });
    const exportedData = [
      [
        'Identifiant des organisations*',
        'Identifiant du createur des campagnes*',
        'Json configuration for quest*',
        'Identifiant du schéma de parcours*',
      ],
      ['', this.currentUser.adminMember.userId.toString(), jsonParsed, blueprint.id.toString()],
    ];

    const csvContent = exportedData
      .map((line) => line.map((data) => `"${data.replaceAll('"', '""').replaceAll('\\""', '\\"')}"`).join(';'))
      .join('\n');

    return 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
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
                  <RequirementTag
                    @type={{requirement.type}}
                    @value={{requirement.value}}
                    @label={{requirement.value}}
                  />
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
              <PixButtonLink @href={{this.makeHref blueprint}} download="{{blueprint.name}}.csv" @iconBefore="download">
                {{t "components.combined-course-blueprints.list.downloadButton"}}
              </PixButtonLink>
            </:cell>
          </PixTableColumn>
        </:columns>
      </PixTable>
    {{else}}
      <div class="table__empty">{{t "common.tables.empty-result"}}</div>
    {{/if}}
  </template>
}
