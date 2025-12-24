import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';

export default class OidcSignupForm extends Component {
  @service oidcIdentityProviders;
  @service intl;
  @service url;

  @tracked isTermsOfServiceValidated = false;
  @tracked signupErrorMessage = null;
  @tracked isLoading = false;

  get userClaimsToDisplay() {
    const { userClaims } = this.args;

    const result = [];

    if (userClaims) {
      const { firstName, lastName, ...rest } = userClaims;
      result.push(this.intl.t('pages.oidc.signup.claims.first-name-label-and-value', { firstName }));
      result.push(this.intl.t('pages.oidc.signup.claims.last-name-label-and-value', { lastName }));

      Object.entries(rest).map(([key, _value]) => {
        let label = `${this.intl.t(`pages.oidc.signup.claims.${key}`)}`;

        if (label.includes('Missing translation')) {
          label = key;
        }

        return result.push(label);
      });
    }

    return result;
  }

  get identityProviderOrganizationName() {
    return this.oidcIdentityProviders.findBySlug(this.args.identityProviderSlug)?.organizationName;
  }

  @action
  onChange(event) {
    this.isTermsOfServiceValidated = !!event.target.checked;
  }

  @action
  signup() {
    //TODO signup user
  }

  <template>
    <div>
      <p class="oidc-signup-form__description">
        {{t "pages.oidc.signup.description"}}
        <em>{{this.identityProviderOrganizationName}}</em>&nbsp;:
      </p>
      <div class="oidc-signup-form__information">
        <ul>
          {{#each this.userClaimsToDisplay as |userClaimToDisplay|}}
            <li>{{userClaimToDisplay}}</li>
          {{/each}}
        </ul>
      </div>
    </div>

    <div class="oidc-signup-form__cgu-container">
      <PixCheckbox {{on "change" this.onChange}}>
        <:label>{{t "common.cgu.label"}}</:label>
      </PixCheckbox>
      <p>
        {{t
          "common.cgu.read-message"
          cguUrl=this.url.cguUrl
          dataProtectionPolicyUrl=this.url.dataProtectionPolicyUrl
          htmlSafe=true
        }}
      </p>
    </div>

    {{#if this.signupErrorMessage}}
      <PixNotificationAlert @type="error" class="oidc-signup-form__error">
        {{this.signupErrorMessage}}
      </PixNotificationAlert>
    {{/if}}

    <PixButton @type="submit" @triggerAction={{this.signup}} @isLoading={{this.isLoading}}>
      {{t "pages.oidc.signup.signup-button"}}
    </PixButton>
  </template>
}
