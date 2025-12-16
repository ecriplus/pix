import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import ModulixIssueReportModal from 'mon-pix/components/module/issue-report/issue-report-modal';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Issue Report | Issue Report Modal', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display issue-report modal with a form inside', async function (assert) {
    // given
    // when
    const screen = await render(
      <template>
        <div id="modal-container">
          <ModulixIssueReportModal @showModal={{true}} />
        </div>
      </template>,
    );

    // then
    assert.dom(screen.getByRole('dialog')).exists();
    assert.dom(screen.getByRole('heading', { name: t('pages.modulix.issue-report.modal.title'), level: 1 })).exists();
    assert.dom(screen.getByRole('button', { name: t('pages.modulix.issue-report.modal.select-label') })).exists();
    assert.dom(screen.getByRole('textbox', { name: t('pages.modulix.issue-report.modal.textarea-label') })).exists();
    assert.dom(screen.getByRole('button', { name: t('common.actions.cancel') })).exists();
    assert.dom(screen.getByRole('button', { name: t('common.actions.send') })).exists();
  });
});
