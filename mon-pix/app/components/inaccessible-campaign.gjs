import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';

export default class InaccessibleCampaign extends Component {
  <template>
    <PixBlock>
      <div class="campaign-landing-page__start__image__container">
        <div class="campaign-landing-page__pix-logo">
          <img class="campaign-landing-page__image" src="/images/pix-logo.svg" alt="{{t 'navigation.pix'}}" />
        </div>
        {{#if this.shouldShowTheMarianneLogo}}
          <div class="campaign-landing-page__marianne-logo">
            <img
              class="campaign-landing-page__image"
              src="/images/logo/logo-de-la-republique-francaise.svg"
              alt="{{t 'common.french-republic'}}"
            />
          </div>
        {{/if}}
      </div>
      <div class="campaign-landing-page-error">
        <h1 class="campaign-landing-page-error__title">{{yield}}</h1>
        <PixButtonLink @route="authenticated" class="campaign-landing-page__error-button">
          {{t "navigation.back-to-profile"}}
        </PixButtonLink>
      </div>
    </PixBlock>
  </template>
  @service currentDomain;

  get shouldShowTheMarianneLogo() {
    return this.currentDomain.isFranceDomain;
  }
}
