import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import sortBy from 'lodash/sortBy';

export default class List extends Component {
  get sortedComplementaryCertifications() {
    return sortBy(this.args.complementaryCertifications, 'label');
  }

  <template>
    <PixTable
      @variant="admin"
      @data={{this.sortedComplementaryCertifications}}
      @caption={{t "components.complementary-certifications.list.caption"}}
    >
      <:columns as |row sortedComplementaryCertification|>
        <PixTableColumn @context={{sortedComplementaryCertification}} class="table__column--medium">
          <:header>
            {{t "components.complementary-certifications.list.id"}}
          </:header>
          <:cell>
            {{row.id}}
          </:cell>
        </PixTableColumn>
        <PixTableColumn @context={{sortedComplementaryCertification}}>
          <:header>
            {{t "components.complementary-certifications.list.name"}}
          </:header>
          <:cell>
            <LinkTo
              @route={{if
                row.hasComplementaryReferential
                "authenticated.complementary-certifications.item.framework"
                "authenticated.complementary-certifications.item.target-profile"
              }}
              @model={{row.id}}
            >
              {{row.label}}
            </LinkTo>
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>
  </template>
}
