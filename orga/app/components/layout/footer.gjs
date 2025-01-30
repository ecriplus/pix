import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class Footer extends Component {
  @service url;

  get currentYear() {
    const date = new Date();
    return date.getFullYear().toString();
  }

  get legalNoticeUrl() {
    return this.url.legalNoticeUrl;
  }

  get accessibilityUrl() {
    return this.url.accessibilityUrl;
  }

  get serverStatusUrl() {
    return this.url.serverStatusUrl;
  }

  <template>
    <footer class="footer">
      <nav class="footer__navigation" aria-label={{t "navigation.footer.aria-label"}}>
        <ul class="footer__navigation-list">
          <li>
            <a href="{{this.legalNoticeUrl}}" target="_blank" class="footer-navigation__item" rel="noopener noreferrer">
              {{t "navigation.footer.legal-notice"}}
            </a>
          </li>

          <li>
            <a
              href="{{this.accessibilityUrl}}"
              target="_blank"
              class="footer-navigation__item"
              rel="noopener noreferrer"
            >
              {{t "navigation.footer.a11y"}}
            </a>
          </li>

          <li>
            <a
              href="{{this.serverStatusUrl}}"
              target="_blank"
              class="footer-navigation__item"
              rel="noopener noreferrer"
            >
              {{t "navigation.footer.server-status"}}
            </a>
          </li>
        </ul>
      </nav>

      <div class="footer__copyrights">
        <span>{{t "navigation.footer.copyrights"}} {{this.currentYear}} {{t "navigation.footer.pix"}}</span>
      </div>
    </footer>
  </template>
}
