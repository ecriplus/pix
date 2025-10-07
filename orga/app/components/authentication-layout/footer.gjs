import { service } from '@ember/service';
import Component from '@glimmer/component';

import FooterLinks from '../footer-links';
import LocaleSwitcher from '../locale-switcher';

export default class Footer extends Component {
  @service currentDomain;

  get isInternationalDomain() {
    return !this.currentDomain.isFranceDomain;
  }

  <template>
    <footer class="authentication-layout-footer">
      {{#if this.isInternationalDomain}}
        <LocaleSwitcher />
      {{/if}}
      <FooterLinks />
    </footer>
  </template>
}
