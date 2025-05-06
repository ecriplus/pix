import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import { on } from '@ember/modifier';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
<template>
  {{pageTitle (t "pages.terms-of-service.title")}}
  <div class="terms-of-service-page">
    <div class="terms-of-service-form">

      <div class="terms-of-service-form__logo">
        <a href={{@controller.showcase.url}}>
          <img class="pix-logo__image" src="/images/pix-logo.svg" alt="{{@controller.showcase.linkText}}" />
        </a>
      </div>

      <h1 class="terms-of-service-form__title">{{t "pages.terms-of-service.title"}}</h1>

      <div class="terms-of-service-form__description">
        {{t "pages.terms-of-service.message"}}
      </div>

      <PixCheckbox @id="pix-cgu" {{on "change" @controller.onChange}}>
        <:label>
          {{t "pages.terms-of-service.cgu" htmlSafe=true}}
        </:label>
      </PixCheckbox>

      {{#if @controller.showErrorTermsOfServiceNotSelected}}
        <div class="terms-of-service-form-conditions__validation-error">
          {{t "pages.terms-of-service.form.error-message"}}
        </div>
      {{/if}}

      <div class="terms-of-service-form__actions">
        <PixButtonLink @route="logout" @variant="tertiary">{{t "common.actions.back"}}</PixButtonLink>

        <PixButton @type="submit" @triggerAction={{@controller.submit}} class="terms-of-service-form-actions__submit">
          {{t "pages.terms-of-service.form.button"}}
        </PixButton>
      </div>

    </div>
  </div>
</template>
