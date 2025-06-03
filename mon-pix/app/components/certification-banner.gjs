import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import startCase from 'lodash/startCase';

export default class CertificationBanner extends Component {
  get candidateFullName() {
    const firstName = this.args.certification.get('firstName');
    const lastName = this.args.certification.get('lastName');
    return `${startCase(firstName)} ${lastName.toUpperCase()}`;
  }

  <template>
    <div class="assessment-banner--certification {{if @shouldBlurBanner 'blur-banner'}}" role="banner">
      <div class="assessment-banner-container">
        <img class="assessment-banner__pix-logo" src="/images/pix-logo-blanc.svg" alt />
        <div class="assessment-banner__splitter"></div>
        {{#if @certification}}
          <h1 class="assessment-banner__title">{{this.candidateFullName}}</h1>
        {{/if}}

        <div class="certification-number">
          <div class="certification-number__label">{{t
              "pages.challenge.certification.banner.certification-number"
            }}</div>
          <div class="certification-number__value">{{@certificationNumber}}</div>
        </div>
      </div>
    </div>
  </template>
}
