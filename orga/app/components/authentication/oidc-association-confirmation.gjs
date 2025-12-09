import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';

export default class OidcAssociationConfirmation extends Component {
  <template>
    <h1 class="oidc-association__title">
      {{t "components.authentication.oidc-association-confirmation.title"}}
      <span class="oidc-association__subtitle">{{t
          "components.authentication.oidc-association-confirmation.sub-title"
        }}</span>
    </h1>
    <p class="oidc-association__information">{{t
        "components.authentication.oidc-association-confirmation.information"
      }}</p>
    <div class="oidc-association__container">
      <div class="oidc-association__user-information">
        <PixIcon @name="userCircle" @plainIcon={{true}} @ariaHidden={{true}} />
        <p>{{@fullNameFromPix}}</p>
        <div class="oidc-association__user-authentication-methods">
          <p>{{t "components.authentication.oidc-association-confirmation.current-authentication-methods"}}</p>
          <dl
            class="oidc-association__user-authentication-methods-list"
            title={{t "components.authentication.oidc-association-confirmation.current-authentication-methods"}}
          >
            {{#if this.shouldShowEmail}}
              <div>
                <dt>{{t "components.authentication.oidc-association-confirmation.email"}}</dt>
                <dd>{{@email}}</dd>
              </div>
            {{/if}}
            {{#if this.shouldShowUsername}}
              <div>
                <dt>{{t "components.authentication.oidc-association-confirmation.username"}}</dt>
                <dd>{{@username}}</dd>
              </div>
            {{/if}}
            {{#each this.oidcAuthenticationMethodOrganizationNames as |organizationName|}}
              <div>
                <dt>{{t "components.authentication.oidc-association-confirmation.external-connection"}}</dt>
                <dd>{{organizationName}}</dd>
              </div>
            {{/each}}
          </dl>
        </div>
      </div>

      <div class="oidc-association__switch-account-button">
        <PixButton @triggerAction={{this.backToLoginOrRegisterForm}} @variant="secondary">{{t
            "components.authentication.oidc-association-confirmation.switch-account"
          }}</PixButton>
      </div>

      <PixIcon @name="arrowTop" @ariaHidden={{true}} class="oidc-association__arrow" />
      <div class="oidc-association__new-authentication-method">
        <p>{{t "components.authentication.oidc-association-confirmation.authentication-method-to-add"}}</p>
        <PixBlock class="oidc-association__authentication-method-to-add">
          <dl title={{t "components.authentication.oidc-association-confirmation.authentication-method-to-add"}}>
            <dt>{{t "components.authentication.oidc-association-confirmation.external-connection-via"}}
              {{@identityProviderOrganizationName}}</dt>
            <dd>{{@fullNameFromExternalIdentityProvider}}</dd>
          </dl>
        </PixBlock>
      </div>

      {{#if this.reconcileErrorMessage}}
        <PixNotificationAlert @type="error" class="oidc-association__container-error">
          {{this.reconcileErrorMessage}}
        </PixNotificationAlert>
      {{/if}}

      <div class="oidc-association__action-buttons">
        <PixButton @triggerAction={{this.backToLoginOrRegisterForm}} @variant="secondary">{{t
            "components.authentication.oidc-association-confirmation.return"
          }}</PixButton>
        <PixButton @triggerAction={{this.reconcile}} @isLoading={{this.isLoading}}>
          {{t "components.authentication.oidc-association-confirmation.confirm"}}
        </PixButton>
      </div>
    </div>
  </template>
  @service intl;
  @service oidcIdentityProviders;
  @service session;
  @service errorMessages;

  @tracked reconcileErrorMessage = null;
  @tracked isLoading = false;

  get shouldShowEmail() {
    return !!this.args.email;
  }

  get shouldShowUsername() {
    return !!this.args.username;
  }

  get oidcAuthenticationMethodOrganizationNames() {
    return this.oidcIdentityProviders.getIdentityProviderNamesByAuthenticationMethods(this.args.authenticationMethods);
  }

  @action
  backToLoginOrRegisterForm() {
    this.args.toggleOidcReconciliation();
  }

  @action
  async reconcile() {
    this.isLoading = true;

    try {
      await this.session.authenticate('authenticator:oidc', {
        authenticationKey: this.args.authenticationKey,
        identityProviderSlug: this.args.identityProviderSlug,
        hostSlug: 'user/reconcile',
      });
    } catch (responseError) {
      this.reconcileErrorMessage = this.errorMessages.getAuthenticationErrorMessage(responseError);
    } finally {
      this.isLoading = false;
    }
  }
}
