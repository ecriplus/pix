import { render } from '@1024pix/ember-testing-library';
import { click, fillIn } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import ModuleIssueReportBlock from 'mon-pix/components/module/issue-report/issue-report-block';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';
import { waitForDialog } from '../../../../helpers/wait-for';

module('Integration | Component | Module | Issue Report | Issue Report Block', function (hooks) {
  setupIntlRenderingTest(hooks);
  module('when feature toggle isModulixIssueReportDisplayed is true', function () {
    test('should display a report button', async function (assert) {
      // given
      const featureToggles = this.owner.lookup('service:featureToggles');
      sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: true });

      // when
      const screen = await render(<template><ModuleIssueReportBlock /></template>);

      // then
      assert.dom(screen.getByRole('button', { name: t('pages.modulix.issue-report.aria-label') })).exists();
    });

    module('when user clicks on report button', function () {
      test('should open the issue report modal', async function (assert) {
        // given
        const featureToggles = this.owner.lookup('service:featureToggles');
        sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: true });

        // when
        const screen = await render(
          <template>
            <div id="modal-container"></div><ModuleIssueReportBlock />
          </template>,
        );
        await click(screen.getByRole('button', { name: t('pages.modulix.issue-report.aria-label') }));
        await waitForDialog();

        // then
        assert.dom(screen.getByRole('dialog')).exists();
        assert
          .dom(screen.getByRole('heading', { name: t('pages.modulix.issue-report.modal.title'), level: 1 }))
          .exists();
      });

      module('when user clicks on send report button', function () {
        test('should send a report', async function (assert) {
          // given
          const featureToggles = this.owner.lookup('service:featureToggles');
          sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: true });
          const issueReportService = this.owner.lookup('service:moduleIssueReport');
          const recordStub = sinon.stub(issueReportService, 'record');
          const elementId = 'b37e8e8d-9875-4b15-85c0-0373ffbb0805';
          const answer = 42;
          const categoryKey = 'accessibility';
          const comment = 'Mon super commentaire de Noel et de joie';
          const reportInfo = { elementId, answer };

          // when
          const screen = await render(
            <template>
              <div id="modal-container"></div><ModuleIssueReportBlock @reportInfo={{reportInfo}} />
            </template>,
          );
          await click(screen.getByRole('button', { name: t('pages.modulix.issue-report.aria-label') }));
          await waitForDialog();

          await click(screen.getByRole('button', { name: t('pages.modulix.issue-report.modal.select-label') }));
          await screen.findByRole('listbox');
          await click(screen.getByRole('option', { name: 'Accessibilité de l‘épreuve' }));

          await fillIn(
            screen.getByRole('textbox', { name: t('pages.modulix.issue-report.modal.textarea-label') }),
            comment,
          );

          await click(screen.getByRole('button', { name: t('common.actions.send') }));

          // then
          sinon.assert.calledOnceWithExactly(recordStub, {
            elementId,
            answer,
            categoryKey,
            comment,
          });
          assert.ok(true);
        });
      });
    });
  });

  module('when feature toggle isModulixIssueReportDisplayed is false', function () {
    test('should not display a report button', async function (assert) {
      // given
      const featureToggles = this.owner.lookup('service:featureToggles');
      sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: false });

      // when
      const screen = await render(<template><ModuleIssueReportBlock /></template>);

      // then
      assert.dom(screen.queryByRole('button', { name: t('pages.modulix.issue-report.aria-label') })).doesNotExist();
    });
  });
});
