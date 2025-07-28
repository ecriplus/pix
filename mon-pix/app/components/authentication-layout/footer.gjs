import { service } from '@ember/service';
import Component from '@glimmer/component';

import FooterLinks from '../footer/footer-links';
import LocaleSwitcher from '../locale-switcher';

export default class Footer extends Component {
  @service currentDomain;
  @service router;

  get isInternationalDomain() {
    return !this.currentDomain.isFranceDomain;
  }

  <template>
    <footer class="authentication-layout-footer" role="contentinfo">
      {{#if this.isInternationalDomain}}
        <LocaleSwitcher />
      {{/if}}
      <FooterLinks @size="extra-small" />
    </footer>
  </template>
}
