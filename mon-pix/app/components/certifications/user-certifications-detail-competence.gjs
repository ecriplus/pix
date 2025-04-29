import PixBlock from '@1024pix/pix-ui/components/pix-block';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import gt from 'ember-truth-helpers/helpers/gt';
import sortBy from 'lodash/sortBy';

export default class UserCertificationsDetailCompetence extends Component {
  <template>
    <PixBlock class="user-certifications-detail-competence user-certifications-detail-competence--{{@area.color}}">
      <table class="user-certifications-detail-competence__list user-certifications-detail-competence-list">
        <thead>
          <tr class="user-certifications-detail-competence-list__header">
            <th>{{@area.title}}</th>
            <th>{{t "common.level"}}</th>
          </tr>
        </thead>
        <tbody>
          {{#each this.sortedCompetences as |competence|}}
            <tr
              class="user-certifications-detail-competence-list__row user-certifications-detail-competence-list-row"
              aria-disabled={{this.isCompetenceDisabled competence}}
            >
              <td class="user-certifications-detail-competence-list-row__name">
                {{competence.name}}
              </td>
              <td class="user-certifications-detail-competence-list-row__level">
                {{if (gt 1 competence.level) "" competence.level}}
              </td>
            </tr>
          {{/each}}
        </tbody>
      </table>
    </PixBlock>
  </template>
  get sortedCompetences() {
    return sortBy(this.args.area?.resultCompetences, 'index');
  }

  isCompetenceDisabled(competence) {
    return competence.level < 1 ? 'true' : 'false';
  }
}
