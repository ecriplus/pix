import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import sortBy from 'lodash/sortBy';

import CertificationStatus from './status';
export default class CertificationsHeader extends Component {
  get sortedCertificationJurySummaries() {
    return sortBy(
      this.args.juryCertificationSummaries,
      'numberOfCertificationIssueReportsWithRequiredAction',
    ).reverse();
  }

  <template>
    {{#if @juryCertificationSummaries}}
      <PixTable
        @variant="admin"
        @data={{this.sortedCertificationJurySummaries}}
        @caption={{t "pages.certifications.table.caption"}}
      >
        <:columns as |certification context|>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.certifications.table.headers.id"}}
            </:header>
            <:cell>
              <LinkTo @route="authenticated.certifications.certification.informations" @model={{certification.id}}>
                {{certification.id}}
              </LinkTo>
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.certifications.table.headers.first-name"}}
            </:header>
            <:cell>
              {{certification.firstName}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.certifications.table.headers.last-name"}}
            </:header>
            <:cell>
              {{certification.lastName}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.certifications.table.headers.status"}}
            </:header>
            <:cell>
              <CertificationStatus @record={{certification}} />
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.certifications.table.headers.unresolved-reports"}}
            </:header>
            <:cell>
              {{certification.numberOfCertificationIssueReportsWithRequiredActionLabel}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.certifications.table.headers.other-certification"}}
            </:header>
            <:cell>
              {{certification.certificationObtained}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.certifications.table.headers.pix-score"}}
            </:header>
            <:cell>
              {{certification.pixScore}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.certifications.table.headers.started-certification-date"}}
            </:header>
            <:cell>
              {{certification.creationDate}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "pages.certifications.table.headers.finished-certification-date"}}
            </:header>
            <:cell>
              {{certification.completionDate}}
            </:cell>
          </PixTableColumn>
        </:columns>
      </PixTable>

      <PixPagination @pagination={{@pagination}} />
    {{else}}
      <p class="tables__empty">{{t "common.tables.empty-result"}}</p>
    {{/if}}
  </template>
}
