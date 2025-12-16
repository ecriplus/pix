import { clickByName, render } from '@1024pix/ember-testing-library';
// eslint-disable-next-line no-restricted-imports
import { click, find } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import ModulixCustomDraft from 'mon-pix/components/module/element/custom-draft';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { waitForDialog } from '../../../helpers/wait-for';

module('Integration | Component | Module | CustomDraft', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display a customDraft with instruction', async function (assert) {
    // given
    const customDraft = {
      id: 'id',
      title: 'title',
      url: 'https://example.org',
      instruction: '<p>Instruction du POIC</p>',
      height: 400,
    };

    // when
    const screen = await render(<template><ModulixCustomDraft @customDraft={{customDraft}} /></template>);

    // then
    assert.ok(screen);
    const expectedIframe = screen.getByTitle(customDraft.title);
    assert.strictEqual(expectedIframe.getAttribute('src'), customDraft.url);
    assert.strictEqual(window.getComputedStyle(expectedIframe).getPropertyValue('height'), `${customDraft.height}px`);
    assert
      .dom(screen.queryByRole('button', { name: t('pages.modulix.buttons.interactive-element.reset.ariaLabel') }))
      .exists();
    assert.dom(screen.getByText('Instruction du POIC')).exists();
  });

  test('should display a customDraft without instruction', async function (assert) {
    // given
    const customDraft = {
      id: 'id',
      title: 'title',
      isCompletionRequired: false,
      url: 'https://example.org',
      height: 400,
    };

    // when
    await render(<template><ModulixCustomDraft @customDraft={{customDraft}} /></template>);

    // then
    assert.dom(find('.element-customDraft__instruction')).doesNotExist();
  });

  module('when user clicks on reset button', function () {
    test('should focus on the iframe', async function (assert) {
      // given
      const customDraft = {
        id: 'id',
        title: 'title',
        isCompletionRequired: false,
        url: 'https://example.org',
        height: 400,
      };
      const screen = await render(<template><ModulixCustomDraft @customDraft={{customDraft}} /></template>);

      // when
      await clickByName(t('pages.modulix.buttons.interactive-element.reset.ariaLabel'));

      // then
      const iframe = screen.getByTitle(customDraft.title);
      assert.strictEqual(document.activeElement, iframe);
    });
  });

  module('when isModulixIssueReportDisplayed FT is enabled', function () {
    test('should display report button', async function (assert) {
      // given
      const customDraft = {
        id: 'id',
        title: 'title',
        url: 'https://example.org',
        instruction: '<p>Instruction du POIC</p>',
        height: 400,
      };
      const featureToggles = this.owner.lookup('service:featureToggles');
      sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: true });

      // when
      const screen = await render(<template><ModulixCustomDraft @customDraft={{customDraft}} /></template>);

      // then
      assert.dom(screen.getByRole('button', { name: t('pages.modulix.issue-report.aria-label') })).exists();
    });

    module('when user clicks on report button', function () {
      test('should display issue-report modal with a form inside', async function (assert) {
        // given
        const customDraft = {
          id: 'id',
          title: 'title',
          url: 'https://example.org',
          instruction: '<p>Instruction du POIC</p>',
          height: 400,
        };
        const featureToggles = this.owner.lookup('service:featureToggles');
        sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: true });

        // when
        const screen = await render(
          <template>
            <div id="modal-container"></div>
            <ModulixCustomDraft @customDraft={{customDraft}} />
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

  module('when isModulixIssueReportDisplayed FT is disabled', function () {
    test('should not display report button', async function (assert) {
      // given
      const customDraft = {
        id: 'id',
        title: 'title',
        url: 'https://example.org',
        instruction: '<p>Instruction du POIC</p>',
        height: 400,
      };
      const featureToggles = this.owner.lookup('service:featureToggles');
      sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: false });

      // when
      const screen = await render(<template><ModulixCustomDraft @customDraft={{customDraft}} /></template>);

      // then
      assert.dom(screen.queryByRole('button', { name: t('pages.modulix.issue-report.aria-label') })).doesNotExist();
    });
  });
});
