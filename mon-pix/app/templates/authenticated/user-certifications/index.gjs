import PixBlock from '@1024pix/pix-ui/components/pix-block';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import Item from 'mon-pix/components/certifications/list/item';
import PageTitle from 'mon-pix/components/ui/page-title';

export default class CertificationEnder extends Component {
  get certificateSummariesSortedByDate() {
    return (
      [...this.args.model].sort((a, b) => {
        return b.certificationStartedAt - a.certificationStartedAt;
      }) ?? []
    );
  }

  <template>
    <main id="main" role="main" class="global-page-container">
      <PageTitle>
        <:title>{{t "pages.certifications-list.title"}}</:title>
        <:subtitle>{{t "pages.certifications-list.description"}}</:subtitle>
      </PageTitle>

      {{#if this.certificateSummariesSortedByDate}}
        <ol class="user-certifications-list">
          {{#each this.certificateSummariesSortedByDate as |certificateSummary|}}
            <li>
              <Item
                data-testid="pw-certification-card-{{certificateSummary.id}}"
                @certificateSummary={{certificateSummary}}
              />
            </li>
          {{/each}}
        </ol>
      {{else}}
        <PixBlock>
          {{t "pages.certifications-list.no-certification.text"}}
        </PixBlock>
      {{/if}}
    </main>
  </template>
}
