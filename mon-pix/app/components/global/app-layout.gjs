import PixAppLayout from '@1024pix/pix-ui/components/pix-app-layout';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import Footer from '../footer';
import NavbarHeader from '../navbar-header';
import Skiplink from '../skiplink';
import AppMainHeader from './app-main-header';
import AppNavigation from './app-navigation';

export default class AppLayout extends Component {
  @service currentUser;
  @service media;
  @service featureToggles;

  get displayAppMainHeader() {
    return this.currentUser.user && !this.media.isMobile;
  }

  <template>
    {{#if this.featureToggles.featureToggles.isPixAppNewLayoutEnabled}}
      <Skiplink @href="#main" @label={{t "common.skip-links.skip-to-content"}} />
      <Skiplink @href="#footer" @label={{t "common.skip-links.skip-to-footer"}} />

      <PixAppLayout class="app-layout">
        <:navigation>
          <AppNavigation />
        </:navigation>
        <:main>
          <div>
            {{#if this.displayAppMainHeader}}
              <AppMainHeader />
            {{/if}}
            {{yield}}
          </div>
        </:main>
        <:footer>
          <Footer />
        </:footer>
      </PixAppLayout>
    {{else}}
      <NavbarHeader />
      {{yield}}
      <Footer />
    {{/if}}
  </template>
}
