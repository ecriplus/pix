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
    </h1>

    <div class="oidc-association__container">

      <div class="oidc-association__user-information">
        <div class="oidc-association__avatar">
          <PixIcon @name="userCircle" @plainIcon={{true}} @ariaHidden={{true}} />
          <p>{{@fullNameFromPix}}</p>
        </div>

        <div class="oidc-association__user-authentication-methods">
          <p>{{t "components.authentication.oidc-association-confirmation.current-authentication-methods"}}</p>
          <dl class="oidc-association__user-authentication-methods-list">
            {{#if this.shouldShowEmail}}
              <dt>{{t "components.authentication.oidc-association-confirmation.email"}}</dt>
              <dd>{{@email}}</dd>
            {{/if}}
            {{#each this.oidcAuthenticationMethodOrganizationNames as |organizationName|}}
              <dt>{{t "components.authentication.oidc-association-confirmation.external-connection"}}</dt>
              <dd>{{organizationName}}</dd>
            {{/each}}
          </dl>

          <PixIcon @name="add" @ariaHidden={{true}} class="oidc-association__arrow" />

          <p>{{t "components.authentication.oidc-association-confirmation.authentication-method-to-add"}}</p>
          <dl class="oidc-association__user-authentication-methods-list">
            <dt>
              {{t "components.authentication.oidc-association-confirmation.external-connection-via"}}
              {{@identityProviderOrganizationName}}
            </dt>
            <dd>{{@fullNameFromExternalIdentityProvider}}</dd>
          </dl>
        </div>
      </div>

      {{#if this.reconcileErrorMessage}}
        <PixNotificationAlert @type="error" class="oidc-association__container-error">
          {{this.reconcileErrorMessage}}
        </PixNotificationAlert>
      {{/if}}

      <div class="oidc-association__action-buttons">
        <PixButton @triggerAction={{this.reconcile}} @isLoading={{this.isLoading}}>
          {{t "components.authentication.oidc-association-confirmation.confirm"}}
        </PixButton>
        <PixButton @triggerAction={{this.backToLoginForm}} @variant="secondary">
          {{t "components.authentication.oidc-association-confirmation.return"}}
        </PixButton>
      </div>
    </div>
  </template>

  @service intl;
  @service oidcIdentityProviders;
  @service session;
  @service authErrorMessages;
  @service router;

  @tracked reconcileErrorMessage = null;
  @tracked isLoading = false;

  get shouldShowEmail() {
    return !!this.args.email;
  }

  get oidcAuthenticationMethodOrganizationNames() {
    return this.oidcIdentityProviders.getIdentityProviderNamesByAuthenticationMethods(this.args.authenticationMethods);
  }

  @action
  backToLoginForm() {
    this.router.transitionTo('authentication.oidc.login', this.args.identityProviderSlug);
  }

  // TODO : gérer la réconciliation et le reconcileErrorMessage dans une prochaine PR
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
      this.reconcileErrorMessage = this.authErrorMessages.getAuthenticationErrorMessage(responseError);
    } finally {
      this.isLoading = false;
    }
  }
}
