import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import DownloadSessionResults from 'mon-pix/components/download-session-results';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | download-session-results', function (hooks) {
  setupIntlRenderingTest(hooks);

  let requestManagerService;

  hooks.beforeEach(function () {
    requestManagerService = this.owner.lookup('service:requestManager');
    sinon.stub(requestManagerService, 'request');
  });

  test('should display component', async function (assert) {
    // given
    // when
    const screen = await render(<template><DownloadSessionResults /></template>);

    // then
    assert.dom(screen.getByRole('heading', { name: t('pages.download-session-results.title'), level: 1 })).exists();
    assert.dom(screen.getByRole('button', { name: t('pages.download-session-results.button.label') })).exists();
  });

  test('should display the expiration error message', async function (assert) {
    // given
    requestManagerService.request.rejects({ status: 500 });

    // when
    const screen = await render(hbs`<DownloadSessionResults @showErrorMessage={{this.showErrorMessage}} />`);
    const downloadButton = screen.getByRole('button', { name: t('pages.download-session-results.button.label') });
    await click(downloadButton);

    // then
    assert.dom(screen.getByText(t('pages.download-session-results.errors.expiration'))).exists();
  });
});
