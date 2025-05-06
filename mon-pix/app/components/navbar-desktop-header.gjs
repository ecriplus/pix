import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import NavbarDesktopMenu from 'mon-pix/components/navbar-desktop-menu';
import PixLogo from 'mon-pix/components/pix-logo';
import UserLoggedMenu from 'mon-pix/components/user-logged-menu';

export default class NavbarDesktopHeader extends Component {
  <template>
    <div class="navbar-desktop-header">
      <div class="navbar-desktop-header__container">
        <div class="navbar-desktop-header-logo">
          {{#if @shouldShowTheMarianneLogo}}
            <div class="navbar-desktop-header-logo__marianne">
              <img src="/images/logo/logo-de-la-republique-francaise.svg" alt="{{t 'common.french-republic'}}" />
            </div>
          {{/if}}
          <PixLogo />
        </div>

        {{#if this.showHeaderMenuItem}}
          <nav class="navbar-desktop-header-container__menu" role="navigation" aria-label={{t "navigation.main.label"}}>
            <ul class="navbar-desktop-header-menu__list">
              <li class="navbar-desktop-header-menu__item">
                <LinkTo @route="authenticated.user-dashboard" class="navbar-desktop-header-menu__link">
                  {{t "navigation.main.dashboard"}}
                </LinkTo>
              </li>
              <li class="navbar-desktop-header-menu__item">
                <LinkTo @route="authenticated.profile" class="navbar-desktop-header-menu__link">
                  {{t "navigation.main.skills"}}
                </LinkTo>
              </li>
              <li class="navbar-desktop-header-menu__item">
                <LinkTo @route="authenticated.certifications" class="navbar-desktop-header-menu__link">
                  {{t "navigation.main.start-certification"}}
                </LinkTo>
              </li>
              <li class="navbar-desktop-header-menu__item">
                <LinkTo @route="authenticated.user-tutorials" class="navbar-desktop-header-menu__link">
                  {{t "navigation.main.tutorials"}}
                </LinkTo>
              </li>
              {{#if this.showMyTrainingsLink}}
                <li class="navbar-desktop-header-menu__item">
                  <LinkTo @route="authenticated.user-trainings" class="navbar-desktop-header-menu__link">
                    {{t "navigation.main.trainings"}}
                  </LinkTo>
                </li>
              {{/if}}
            </ul>
            <ul class="navbar-desktop-header-right">
              <li>
                <PixButtonLink @route="fill-in-campaign-code">
                  {{t "navigation.main.code"}}
                </PixButtonLink>
              </li>
              <li>
                <UserLoggedMenu />
              </li>
            </ul>
          </nav>

        {{else}}
          <div class="navbar-desktop-header-right">
            <NavbarDesktopMenu @menu={{this.menu}} />
          </div>
        {{/if}}
      </div>
    </div>
  </template>
  @service router;
  @service session;
  @service intl;
  @service currentUser;

  get isUserLogged() {
    return this.session.isAuthenticated;
  }

  get menu() {
    return this.isUserLogged || this._isExternalUser ? [] : this._menuItems;
  }

  get _menuItems() {
    return [
      {
        name: this.intl.t('navigation.not-logged.sign-in'),
        link: 'authentication.login',
        class: 'navbar-menu-signin-link',
      },
      { name: this.intl.t('navigation.not-logged.sign-up'), link: 'inscription', class: 'navbar-menu-signup-link' },
    ];
  }

  get _isExternalUser() {
    return this.session.isAuthenticatedByGar;
  }

  get showHeaderMenuItem() {
    return this.isUserLogged && !this.currentUser.user.isAnonymous;
  }

  get showMyTrainingsLink() {
    return this.currentUser.user.hasRecommendedTrainings;
  }
}
