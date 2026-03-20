import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import FooterLinks from '../footer-links';
import LocaleSwitcher from '../locale-switcher';

export default class Footer extends Component {
  @service currentDomain;

  <template>
    <footer class="authentication-layout-footer" aria-label={{t "navigation.footer.aria-label"}}>
      {{#if this.currentDomain.isInternationalDomain}}
        <LocaleSwitcher />
      {{/if}}
      <FooterLinks @size="extra-small" />
    </footer>
  </template>
}
