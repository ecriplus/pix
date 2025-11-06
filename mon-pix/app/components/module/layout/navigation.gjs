import PixNavigation from '@1024pix/pix-ui/components/pix-navigation';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import ModulixNavigationButton from './navigation-button';

export default class ModulixNavigation extends Component {
  @service modulixNavigationProgress;

  @action isCurrentSection(index) {
    return this.modulixNavigationProgress.currentSectionIndex === index;
  }

  @action isPastSection(index) {
    return this.modulixNavigationProgress.currentSectionIndex > index;
  }

  @action handleArrowKeyNavigation(event) {
    const triggeredButton = document.activeElement;
    const triggeredButtonParent = triggeredButton.parentElement;
    const navigationButtonsList = triggeredButtonParent.parentNode.children;
    const triggeredButtonParentIndex = Array.from(navigationButtonsList).indexOf(triggeredButtonParent);

    const totalSections = this.args.sections.length;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();

      if (triggeredButtonParentIndex + 1 < totalSections) {
        const nextButton = triggeredButtonParent.nextElementSibling.firstElementChild;
        nextButton.focus();
      } else {
        triggeredButton.focus();
      }
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();

      if (triggeredButtonParentIndex >= 1) {
        const previousButton = triggeredButtonParent.previousElementSibling.firstElementChild;
        previousButton.focus();
      } else {
        triggeredButton.focus();
      }
    }
  }

  <template>
    <PixNavigation
      class="app-navigation module-navigation"
      @navigationAriaLabel={{t "navigation.nav-bar.aria-label"}}
      @openLabel={{t "navigation.nav-bar.open"}}
      @closeLabel={{t "navigation.nav-bar.close"}}
    >
      <:brand>
        <img class="module-navigation__logo" src="/images/modulix-pix-logo.svg" alt={{t "navigation.homepage"}} />
      </:brand>
      <:navElements>
        {{#each @sections as |section index|}}
          <ModulixNavigationButton
            @section={{section}}
            @isCurrentSection={{this.isCurrentSection index}}
            @isPastSection={{this.isPastSection index}}
            @sections={{@sections}}
            @handleArrowKeyNavigation={{this.handleArrowKeyNavigation}}
          />
        {{/each}}
      </:navElements>
    </PixNavigation>
  </template>
}
