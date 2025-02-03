import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixNavigation from '@1024pix/pix-ui/components/pix-navigation';
import PixNavigationButton from '@1024pix/pix-ui/components/pix-navigation-button';
import PixNavigationSeparator from '@1024pix/pix-ui/components/pix-navigation-separator';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import PixLogo from '../pix-logo';

export default class AppNavigation extends Component {
  @service currentDomain;
  @service currentUser;
  @service media;
  @service url;

  get isFrenchLocale() {
    return this.currentDomain.isFranceDomain;
  }

  get showAssessmentsNavItem() {
    return this.currentUser.user.hasAssessmentParticipations;
  }

  get showTrainingsNavItem() {
    return this.currentUser.user.hasRecommendedTrainings;
  }

  <template>
    <PixNavigation class="app-navigation" @navigationAriaLabel="navigation principale">
      <:brand>
        {{#if this.isFrenchLocale}}
          <img
            class="app-navigation__logo-republique-fr"
            src="/images/logo/logo-de-la-republique-francaise-blanc.svg"
            alt="{{t 'common.french-republic'}}"
          />
        {{/if}}
        <PixLogo @color="white" />
      </:brand>
      <:navElements>
        {{#if this.currentUser.user}}
          <PixNavigationButton @route="authenticated.user-dashboard" @icon="home">
            {{t "navigation.main.dashboard"}}
          </PixNavigationButton>
          <PixNavigationButton @route="authenticated.profile" @icon="star">
            {{t "navigation.main.skills"}}
          </PixNavigationButton>
          {{#if this.showAssessmentsNavItem}}
            <PixNavigationButton @route="authenticated.user-tests" @icon="conversionPath">
              {{t "navigation.user.tests"}}
            </PixNavigationButton>
          {{/if}}
          <PixNavigationButton @route="authenticated.certifications" @icon="newRealease">
            {{t "navigation.main.start-certification"}}
          </PixNavigationButton>
          {{#if this.showTrainingsNavItem}}
            <PixNavigationButton @route="authenticated.user-trainings" @icon="book">
              {{t "navigation.main.trainings"}}
            </PixNavigationButton>
          {{/if}}
          <PixNavigationButton @route="authenticated.user-tutorials" @icon="bookmark">
            {{t "navigation.main.tutorials"}}
          </PixNavigationButton>
        {{else}}
          <PixButtonLink @route="authentication.login" @variant="primary-bis" @iconBefore="login">
            {{t "navigation.not-logged.sign-in"}}
          </PixButtonLink>
          <PixButtonLink @route="inscription" @variant="primary">
            {{t "navigation.not-logged.sign-up"}}
          </PixButtonLink>
        {{/if}}
      </:navElements>
      <:footer>
        {{#if this.media.isMobile}}
          <PixButtonLink
            class="app-main-header__campaign-code-button"
            @route="fill-in-campaign-code"
            title={{t "pages.fill-in-campaign-code.start"}}
            @iconBefore="codeNumber"
          >
            {{t "navigation.main.code"}}
          </PixButtonLink>
          <PixNavigationSeparator />
          <strong>{{this.currentUser.user.fullName}}</strong>
          <PixButtonLink @route="authenticated.user-account" @iconBefore="shieldPerson">
            {{t "navigation.user.account"}}
          </PixButtonLink>
          <PixButtonLink @route="logout" @variant="secondary" @iconBefore="power">
            {{t "navigation.user.sign-out"}}
          </PixButtonLink>
          <PixNavigationSeparator />
        {{/if}}
        <PixButtonLink href={{this.url.supportHomeUrl}} target="_blank" @variant="tertiary" @iconBefore="help">
          {{t "navigation.footer.help-center"}}
        </PixButtonLink>
      </:footer>
    </PixNavigation>
  </template>
}
