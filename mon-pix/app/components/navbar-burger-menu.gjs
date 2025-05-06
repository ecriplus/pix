import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixSidebar from '@1024pix/pix-ui/components/pix-sidebar';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';

export default class NavbarBurgerMenu extends Component {
  <template>
    <PixSidebar
      @showSidebar={{@showSidebar}}
      @onClose={{@onClose}}
      @title={{this.currentUser.user.fullName}}
      id="principal-menu"
    >
      <:content>
        <div class="navbar-burger__menu" role="navigation">
          <div class="navbar-burger-menu__content">
            <ul class="navbar-burger-menu__list">
              <li class="navbar-burger-menu-list__item">
                <LinkTo @route="authenticated.user-dashboard" class="navbar-burger-menu-list-item__link">
                  {{t "navigation.main.dashboard"}}
                </LinkTo>
              </li>
              <li class="navbar-burger-menu-list__item">
                <LinkTo @route="authenticated.profile" class="navbar-burger-menu-list-item__link">
                  {{t "navigation.main.skills"}}
                </LinkTo>
              </li>
              <li class="navbar-burger-menu-list__item">
                <LinkTo @route="authenticated.certifications" class="navbar-burger-menu-list-item__link">
                  {{t "navigation.main.start-certification"}}
                </LinkTo>
              </li>
              <li class="navbar-burger-menu-list__item">
                <LinkTo @route="authenticated.user-tutorials" class="navbar-burger-menu-list-item__link">
                  {{t "navigation.main.tutorials"}}
                </LinkTo>
              </li>
              {{#if this.showMyTrainingsLink}}
                <li class="navbar-burger-menu-list__item">
                  <LinkTo @route="authenticated.user-trainings" class="navbar-burger-menu-list-item__link">
                    {{t "navigation.main.trainings"}}
                  </LinkTo>
                </li>
              {{/if}}
            </ul>
            <div class="navbar-burger-menu__button">
              <LinkTo @route="fill-in-campaign-code" class="button button--thin">
                {{t "navigation.main.code"}}
              </LinkTo>
            </div>
          </div>
          <ul class="navbar-burger-menu__footer">
            {{#if this.showMyTestsLink}}
              <li class="navbar-burger-menu-list__item">
                <LinkTo @route="authenticated.user-tests" class="navbar-burger-menu-footer-item__link">
                  {{t "navigation.user.tests"}}
                </LinkTo>
              </li>
            {{/if}}
            <li class="navbar-burger-menu-list__item">
              <LinkTo @route="authenticated.user-account" class="navbar-burger-menu-footer-item__link">
                {{t "navigation.user.account"}}
              </LinkTo>
            </li>
            <li class="navbar-burger-menu-list__item">
              <LinkTo @route="authenticated.user-certifications" class="navbar-burger-menu-footer-item__link">
                {{t "navigation.user.certifications"}}
              </LinkTo>
            </li>
            <li class="navbar-burger-menu-list__item">
              <a
                href="{{t 'navigation.main.link-help'}}"
                target="_blank"
                class="navbar-burger-menu-footer-item__link"
                rel="noopener noreferrer"
              >
                {{t "navigation.main.help"}}
              </a>
            </li>
            <li class="navbar-burger-menu-list__item">
              <LinkTo
                @route="logout"
                class="navbar-burger-menu-footer-item__link navbar-burger-menu-footer-item__link--logout"
              >
                <PixIcon @name="power" @ariaHidden={{true}} class="navbar-burger-menu-footer-list-item-logout__icon" />
                {{t "navigation.user.sign-out"}}
              </LinkTo>
            </li>
          </ul>
        </div>
      </:content>
    </PixSidebar>
  </template>
  @service currentUser;

  get showMyTestsLink() {
    return this.currentUser.user.hasAssessmentParticipations;
  }

  get showMyTrainingsLink() {
    return this.currentUser.user.hasRecommendedTrainings;
  }
}
