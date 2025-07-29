import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import { concat } from '@ember/helper';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import LocaleSwitcher from '../locale-switcher';
import PageTitle from '../ui/page-title';
import LoginForm from './login-form';
import RegisterForm from './register-form';

export default class LoginOrRegister extends Component {
  @service currentDomain;
  @service router;

  @tracked displayRegisterForm = true;

  get isInternationalDomain() {
    return !this.currentDomain.isFranceDomain;
  }

  @action
  toggleFormsVisibility() {
    this.displayRegisterForm = !this.displayRegisterForm;
  }

  <template>
    <div class="login-or-register">
      <PixBlock class="login-or-register__panel" @variant="orga">
        <div>
          <img src="/pix-orga-color.svg" alt="" role="none" class="login-or-register-panel__logo" />
        </div>
        <span class="login-or-register-panel__invitation">{{t
            "pages.login-or-register.title"
            organizationName=@organizationName
          }}</span>
        <div class="login-or-register-panel__forms-container">
          <div class="login-or-register-panel__form">
            <PageTitle @centerTitle={{true}}>
              <:title>{{t "pages.login-or-register.register-form.title"}}</:title>
            </PageTitle>
            {{#unless this.displayRegisterForm}}
              <PixButton id="register" @triggerAction={{this.toggleFormsVisibility}} @variant="secondary">
                {{t "pages.login-or-register.register-form.button"}}
              </PixButton>
            {{/unless}}
            <div
              class={{concat
                "login-or-register-panel-form__expandable"
                (if this.displayRegisterForm " login-or-register-panel-form__expandable--expanded")
              }}
            >
              {{#if this.displayRegisterForm}}
                <RegisterForm
                  @organizationInvitationId={{@organizationInvitationId}}
                  @organizationInvitationCode={{@organizationInvitationCode}}
                />
              {{/if}}
            </div>
          </div>
          <div class="login-or-register-panel__divider"></div>
          <div class="login-or-register-panel__form">
            <PageTitle @centerTitle={{true}}>
              <:title>{{t "pages.login-or-register.login-form.title"}}</:title>
            </PageTitle>
            {{#if this.displayRegisterForm}}
              <PixButton id="login" @triggerAction={{this.toggleFormsVisibility}} @variant="secondary">
                {{t "pages.login-or-register.login-form.button"}}
              </PixButton>
            {{/if}}
            <div
              class={{concat
                "login-or-register-panel-form__expandable"
                (unless this.displayRegisterForm " login-or-register-panel-form__expandable--expanded")
              }}
            >
              {{#unless this.displayRegisterForm}}
                <LoginForm
                  @isWithInvitation={{true}}
                  @organizationInvitationId={{@organizationInvitationId}}
                  @organizationInvitationCode={{@organizationInvitationCode}}
                />
              {{/unless}}
            </div>
          </div>
        </div>
      </PixBlock>
      {{#if this.isInternationalDomain}}
        <div class="login-or-register__locale-switcher">
          <LocaleSwitcher />
        </div>
      {{/if}}
    </div>
  </template>
}
