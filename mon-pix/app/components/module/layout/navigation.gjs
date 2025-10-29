import PixNavigation from '@1024pix/pix-ui/components/pix-navigation';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import ModulixNavigationButton from './navigation-button';

export default class ModulixNavigation extends Component {
  @service intl;

  @action
  dummyFunction() {}

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
        {{#each @sections as |section|}}
          <ModulixNavigationButton @section={{section}} />
        {{/each}}
      </:navElements>
    </PixNavigation>
  </template>
}
