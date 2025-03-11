import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

import FooterLinks from './footer-links';

export default class Footer extends Component {
  @service currentDomain;

  get currentYear() {
    const date = new Date();
    return date.getFullYear().toString();
  }

  <template>
    <footer id="footer" class="footer" role="contentinfo">
      <div class="footer__logos">
        {{#if this.currentDomain.isFranceDomain}}
          <img src="/images/logo/logo-de-la-republique-francaise.svg" alt="{{t 'common.french-republic'}}" />
        {{/if}}
        <img src="/images/pix-logo.svg" class="footer__logos__pix-logo" alt={{t "common.pix"}} />
        <div class="copyrights">
          <span>{{t "navigation.copyrights"}} {{this.currentYear}} {{t "navigation.pix"}}</span>
        </div>
      </div>
      <FooterLinks @textAlign="right" />
    </footer>
  </template>
}
