import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import sortBy from 'lodash/sortBy';
import UserCertificationsDetailCompetence from 'mon-pix/components/certifications/user-certifications-detail-competence';

export default class UserCertificationsDetailCompetencesList extends Component {
  <template>
    <div class="user-certifications-detail-competences-list">
      <h2>{{t "pages.certificate.competences.title"}}
        <span>{{t "pages.certificate.competences.subtitle" maxReachableLevel=this.maxReachableLevel}}</span></h2>

      {{#each this.sortedAreas as |area|}}
        <UserCertificationsDetailCompetence @area={{area}} />
      {{/each}}

    </div>
  </template>
  get sortedAreas() {
    return sortBy(this.args.resultCompetenceTree.get('areas'), 'code');
  }

  get maxReachableLevel() {
    return this.args.maxReachableLevelOnCertificationDate;
  }
}
