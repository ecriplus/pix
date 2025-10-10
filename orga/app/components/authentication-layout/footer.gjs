import { service } from '@ember/service';
import Component from '@glimmer/component';

import FooterLinks from '../footer-links';
import LocaleSwitcher from '../locale-switcher';

export default class Footer extends Component {
  @service currentDomain;

  <template>
    <footer class="authentication-layout-footer">
      {{#if this.currentDomain.isInternationalDomain}}
        <LocaleSwitcher />
      {{/if}}
      <FooterLinks />
    </footer>
  </template>
}
