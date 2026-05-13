import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';

export default class InaccessibleContent extends Component {
  get buttonText() {
    return this.args.buttonText ?? 'navigation.back-to-profile';
  }
  <template>
    <PixBlock ...attributes>
      <div class="campaign-landing-page__start__image__container">
        <div class="campaign-landing-page__pix-logo">
          <img class="campaign-landing-page__image" src="/images/pix-logo.svg" alt="{{t 'navigation.pix'}}" />
        </div>
      </div>
      <div class="campaign-landing-page-error">
        <h1 class="campaign-landing-page-error__title">{{yield to="title"}}</h1>
        {{#if (has-block "content")}}
          {{yield to="content"}}
        {{/if}}
        {{#if (has-block "instructions")}}
          <div class="campaign-landing-page-error__instructions">{{yield to="instructions"}}</div>
        {{/if}}
        <PixButtonLink @route="authenticated" class="campaign-landing-page__error-button">
          {{t this.buttonText}}
        </PixButtonLink>
      </div>
    </PixBlock>
  </template>
}
