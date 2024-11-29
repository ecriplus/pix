import PixBackgroundHeader from '@1024pix/pix-ui/components/pix-background-header';
import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixMessage from '@1024pix/pix-ui/components/pix-message';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import ENV from 'mon-pix/config/environment';

export default class DownloadSessionResults extends Component {
  @tracked showErrorMessage = false;
  @service requestManager;

  @action
  async downloadSessionResults() {
    this.showErrorMessage = false;

    try {
      await this.requestManager.request({
        url: `${ENV.APP.API_HOST}/api/xxx`,
        method: 'POST',
        body: { token: 'xxx' },
      });
    } catch {
      this.showErrorMessage = true;
    }
  }

  <template>
    <PixBackgroundHeader id="main">
      <PixBlock class="download-session-results">
        <form class="download-session-results__form" autocomplete="off">

          <h1 class="form__title">
            {{t "pages.download-session-results.title"}}
          </h1>

          <PixButton @type="submit" @triggerAction={{this.downloadSessionResults}} @size="large" class="form__actions">
            {{t "pages.download-session-results.button.label"}}
          </PixButton>

          {{#if this.showErrorMessage}}
            <PixMessage @type="error" class="form__error">
              {{t "pages.download-session-results.errors.expiration"}}
            </PixMessage>
          {{/if}}
        </form>
      </PixBlock>
    </PixBackgroundHeader>
  </template>
}
