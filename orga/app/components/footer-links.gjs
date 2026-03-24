import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';

export default class FooterLinks extends Component {
  @service url;

  get legalNoticeUrl() {
    return this.url.legalNoticeUrl;
  }

  get accessibilityUrl() {
    return this.url.accessibilityUrl;
  }

  get serverStatusUrl() {
    return this.url.serverStatusUrl;
  }

  get supportHomeUrl() {
    return this.url.supportHomeUrl;
  }

  get currentYear() {
    const date = new Date();
    return date.getFullYear().toString();
  }

  <template>
    <div class="footer">
      <nav class="footer__links" role="navigation" aria-label={{t "navigation.footer.label"}}>
        <ul
          class="footer-links__list
            {{if (eq @size 'extra-small') 'footer-links__list--extra-small' 'footer-links__list--small'}}
            {{if (eq @textAlign 'right') 'footer-links__list--align-right'}}"
        >
          <li>
            <a href="{{this.legalNoticeUrl}}" target="_blank" rel="noopener noreferrer">
              {{t "navigation.footer.legal-notice"}}
            </a>
          </li>

          <li>
            <a href="{{this.accessibilityUrl}}" target="_blank" rel="noopener noreferrer">
              {{t "navigation.footer.a11y"}}
            </a>
          </li>

          <li>
            <a href="{{this.serverStatusUrl}}" target="_blank" rel="noopener noreferrer">
              {{t "navigation.footer.server-status"}}
            </a>
          </li>

          <li>
            <a href="{{this.supportHomeUrl}}" target="_blank" rel="noopener noreferrer">
              {{t "navigation.footer.help-center"}}
            </a>
          </li>

        </ul>
      </nav>
      <div class="footer-links__copyrights">
        <span>{{t "navigation.footer.copyrights"}} {{this.currentYear}} {{t "navigation.footer.pix"}}</span>
      </div>
    </div>
  </template>
}
