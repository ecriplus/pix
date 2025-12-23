import { render } from '@1024pix/ember-testing-library';
import { click, fillIn } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import ModulixIssueReportModal from 'mon-pix/components/module/issue-report/issue-report-modal';
import { module, test } from 'qunit';
import sinon from 'sinon';

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

  module('when user fills the form and clicks on send button', function () {
    test('should call onSendReport function with issue report information', async function (assert) {
      // given
      const hideModal = sinon.stub();
      const onSendReport = sinon.stub();

      // when
      const screen = await render(
        <template>
          <div id="modal-container">
            <ModulixIssueReportModal @showModal={{true}} @hideModal={{hideModal}} @onSendReport={{onSendReport}} />
          </div>
        </template>,
      );

      await click(screen.getByRole('button', { name: t('pages.modulix.issue-report.modal.select-label') }));
      await screen.findByRole('listbox');
      await click(screen.getByRole('option', { name: 'La réponse' }));

      await fillIn(
        screen.getByRole('textbox', { name: t('pages.modulix.issue-report.modal.textarea-label') }),
        'Mon super commentaire',
      );

      await click(screen.getByRole('button', { name: t('common.actions.send') }));

      // then
      sinon.assert.calledOnceWithExactly(onSendReport, {
        categoryKey: 'answer',
        comment: 'Mon super commentaire',
      });

      assert.ok(true);
    });
  });

  module('when user do not fill the comment section and clicks on send button', function () {
    test('should display an error', async function (assert) {
      // given
      const hideModal = sinon.stub();
      const onSendReport = sinon.stub();

      // when
      const screen = await render(
        <template>
          <div id="modal-container">
            <ModulixIssueReportModal @showModal={{true}} @hideModal={{hideModal}} @onSendReport={{onSendReport}} />
          </div>
        </template>,
      );

      await click(screen.getByRole('button', { name: t('pages.modulix.issue-report.modal.select-label') }));
      await screen.findByRole('listbox');
      await click(screen.getByRole('option', { name: 'La réponse' }));
      await click(screen.getByRole('button', { name: t('common.actions.send') }));

      // then
      sinon.assert.notCalled(onSendReport);
      assert.dom(screen.getByText(t('pages.modulix.issue-report.error-messages.missing-comment'))).exists();
    });
  });
});
