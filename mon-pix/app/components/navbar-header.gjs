import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import media from 'ember-responsive/helpers/media';
import NavbarDesktopHeader from 'mon-pix/components/navbar-desktop-header';
import NavbarMobileHeader from 'mon-pix/components/navbar-mobile-header';
import Skiplink from 'mon-pix/components/skiplink';

export default class NavbarHeader extends Component {
  <template>
    <Skiplink @href="#main" @label={{t "common.skip-links.skip-to-content"}} />
    <Skiplink @href="#footer" @label={{t "common.skip-links.skip-to-footer"}} />

    <header id="global-header" role="banner">
      <div class="navbar-header">
        {{#if (media "isDesktop")}}
          <NavbarDesktopHeader @shouldShowTheMarianneLogo={{this.isFrenchDomainExtension}} />
        {{else}}
          <NavbarMobileHeader @shouldShowTheMarianneLogo={{this.isFrenchDomainExtension}} />
        {{/if}}
      </div>
    </header>
  </template>
  @service currentDomain;

  get isFrenchDomainExtension() {
    return this.currentDomain.isFranceDomain;
  }
}
