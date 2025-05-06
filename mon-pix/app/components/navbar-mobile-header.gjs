/* eslint ember/no-computed-properties-in-native-classes: 0 */

import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';
import NavbarBurgerMenu from 'mon-pix/components/navbar-burger-menu';
import PixLogo from 'mon-pix/components/pix-logo';

export default class NavbarMobileHeader extends Component {
  <template>
    <div class="navbar-mobile-header">
      <div class="navbar-mobile-header__container">
        {{#if this.isUserLogged}}
          <nav role="navigation" aria-label={{t "navigation.main.label"}}>
            <button
              class="navbar-mobile-header__burger-icon"
              {{on "click" this.openMenu}}
              type="button"
              aria-labelledby="nav-mobile-button"
              aria-expanded="{{this.isMenuOpen}}"
              aria-controls="principale-menu"
            >
              <span id="nav-mobile-button" class="sr-only">{{t "navigation.mobile-button-title"}}</span>
              <PixIcon @name="menu" @ariaHidden={{true}} />
            </button>

            <NavbarBurgerMenu @showSidebar={{this.isMenuOpen}} @onClose={{this.closeMenu}} />
          </nav>
        {{/if}}

        <div class="navbar-mobile-header__logo">
          <div class="navbar-mobile-header-logo__pix">
            <PixLogo />
          </div>
          {{#if @shouldShowTheMarianneLogo}}
            <div class="navbar-mobile-header-logo__marianne">
              <img src="/images/logo/logo-de-la-republique-francaise.svg" alt={{t "common.french-republic"}} />
            </div>
          {{/if}}
        </div>
      </div>
    </div>
  </template>
  @service session;
  @service currentUser;
  @tracked isMenuOpen = false;

  @alias('session.isAuthenticated') isUserLogged;

  get title() {
    return this.isUserLogged ? this.currentUser.user.fullName : '';
  }

  @action
  openMenu() {
    this.isMenuOpen = true;
  }

  @action
  closeMenu() {
    this.isMenuOpen = false;
  }
}
