import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
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
