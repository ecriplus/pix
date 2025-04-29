import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import t from 'ember-intl/helpers/t';
import UpdateEmailWithValidation from 'mon-pix/components/user-account/update-email-with-validation';
<template>
  <div class="user-account__connection-methods">
    {{#if @controller.isEmailEditionMode}}
      <UpdateEmailWithValidation
        @disableEmailEditionMode={{@controller.disableEmailEditionMode}}
        @displayEmailUpdateMessage={{@controller.displayEmailUpdateMessage}}
      />
    {{else}}
      {{#if @controller.shouldShowPixAuthenticationMethod}}
        {{#if @controller.shouldShowEmail}}
          <div class="user-account-panel__item{{if @controller.showEmailUpdatedMessage ' with-success-message'}}">
            <div class="user-account-panel-item__text">
              <p class="form-textfield__label user-account-panel-item__label">
                {{t "pages.user-account.connexion-methods.email"}}
              </p>
              <p class="user-account-panel-item__value" data-test-email>{{@model.user.email}}</p>
            </div>
            <div>
              <PixButton
                class="user-account-panel-item__button"
                @triggerAction={{@controller.enableEmailEditionMode}}
                @size="small"
              >
                {{t "pages.user-account.connexion-methods.edit-button"}}
              </PixButton>
            </div>
          </div>

          {{#if @controller.showEmailUpdatedMessage}}
            <PixNotificationAlert @type="success" @withIcon={{true}} class="user-account-panel__success-message">
              {{t "pages.user-account.email-verification.update-successful"}}
            </PixNotificationAlert>
          {{/if}}

          {{#if @controller.shouldShowEmailConfirmedBanner}}
            <PixNotificationAlert @type="success" @withIcon={{true}} class="user-account-panel__success-message">
              {{t "pages.user-account.email-confirmed"}}
            </PixNotificationAlert>
          {{/if}}
        {{/if}}

        {{#if @controller.shouldShowUsername}}
          <div class="user-account-panel__item">
            <div class="user-account-panel-item__text">
              <p class="form-textfield__label user-account-panel-item__label">
                {{t "pages.user-account.connexion-methods.username"}}
              </p>
              <p class="user-account-panel-item__value" data-test-username>{{@model.user.username}}</p>
            </div>
          </div>
        {{/if}}
      {{/if}}

      {{#if @controller.shouldShowGarAuthenticationMethod}}
        <div class="user-account-panel__item">
          <div class="user-account-panel-item__text">
            <p class="form-textfield__label user-account-panel-item__label">{{t
                "pages.user-account.connexion-methods.authentication-methods.label"
              }}</p>
            <p class="user-account-panel-item__value">
              {{t "pages.user-account.connexion-methods.authentication-methods.gar"}}
            </p>
          </div>
        </div>
      {{/if}}

      {{#each @controller.oidcAuthenticationMethodOrganizationNames as |organizationName|}}
        <div class="user-account-panel__item">
          <div class="user-account-panel-item__text">
            <p class="form-textfield__label user-account-panel-item__label">
              {{t "pages.user-account.connexion-methods.authentication-methods.label"}}
            </p>
            <p class="user-account-panel-item__value">
              {{t
                "pages.user-account.connexion-methods.authentication-methods.via"
                identityProviderOrganizationName=organizationName
              }}
            </p>
          </div>
        </div>
      {{/each}}
    {{/if}}
  </div>
</template>
