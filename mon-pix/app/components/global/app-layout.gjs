import PixAppLayout from '@1024pix/pix-ui/components/pix-app-layout';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import CommunicationBanner from '../communication-banner';
import DataProtectionPolicyInformationBanner from '../data-protection-policy-information-banner';
import Footer from '../footer';
import InformationBanners from '../information-banners';
import Skiplink from '../skiplink';
import AppMainHeader from './app-main-header';
import AppNavigation from './app-navigation';

export default class AppLayout extends Component {
  @service router;
  @service session;
  @service currentUser;
  @service media;

  get displayAppMainHeader() {
    return this.args.displayFullLayout && this.session.isAuthenticated && this.currentUser.user && !this.media.isMobile;
  }

  <template>
    {{#if @displayFullLayout}}
      <Skiplink @href="#main" @label={{t "common.skip-links.skip-to-content"}} />
      <Skiplink @href="#footer" @label={{t "common.skip-links.skip-to-footer"}} />
    {{/if}}

    <PixAppLayout class="{{unless @displayFullLayout 'unauthenticated-page'}}">
      <:banner>
        {{#if @displayFullLayout}}
          <DataProtectionPolicyInformationBanner />
        {{/if}}
        <CommunicationBanner />
        <InformationBanners @banners={{@banners}} />
      </:banner>
      <:navigation>
        {{#if @displayFullLayout}}
          <AppNavigation />
        {{/if}}
      </:navigation>
      <:main>
        {{#if this.displayAppMainHeader}}
          <AppMainHeader />
        {{/if}}

        {{yield}}
      </:main>
      <:footer>
        {{#if @displayFullLayout}}
          <Footer />
        {{/if}}
      </:footer>
    </PixAppLayout>
  </template>
}
