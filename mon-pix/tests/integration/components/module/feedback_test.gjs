import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import ModulixFeedback from 'mon-pix/components/module/feedback';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Feedback', function (hooks) {
  setupIntlRenderingTest(hooks);
  test('should display feedback information', async function (assert) {
    // given
    const feedback = {
      state: 'Correct !',
      diagnosis: "<p>C'est la bonne réponse !</p>",
    };

    // when
    const screen = await render(
      <template><ModulixFeedback @answerIsValid={{true}} @feedback={{feedback}} /></template>,
    );

    // then
    assert.dom(screen.getByText('Correct !')).exists();
    assert.dom(screen.getByText("C'est la bonne réponse !")).exists();
  });

  test('should not display a span when "feedback.state" does not exist', async function (assert) {
    // given
    const feedback = {
      diagnosis: "<p>C'est la bonne réponse !</p>",
    };

    // when
    const screen = await render(
      <template><ModulixFeedback @answerIsValid={{true}} @feedback={{feedback}} /></template>,
    );

    // then
    assert.dom(screen.getByText("C'est la bonne réponse !")).exists();
  });

  module('when isModulixIssueReportDisplayed FT is enabled', function () {
    test('should display report button', async function (assert) {
      // given
      const feedback = {
        state: 'Correct !',
        diagnosis: "<p>C'est la bonne réponse !</p>",
      };
      const featureToggles = this.owner.lookup('service:featureToggles');
      sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: true });

      // when
      const screen = await render(
        <template><ModulixFeedback @answerIsValid={{true}} @feedback={{feedback}} /></template>,
      );

      // then
      assert.dom(screen.getByRole('button', { name: t('pages.modulix.issue-report.aria-label') })).exists();
    });
  });

  module('when isModulixIssueReportDisplayed FT is disabled', function () {
    test('should not display report button', async function (assert) {
      // given
      const feedback = {
        state: 'Correct !',
        diagnosis: "<p>C'est la bonne réponse !</p>",
      };
      const featureToggles = this.owner.lookup('service:featureToggles');
      sinon.stub(featureToggles, 'featureToggles').value({ isModulixIssueReportDisplayed: false });

      // when
      const screen = await render(
        <template><ModulixFeedback @answerIsValid={{true}} @feedback={{feedback}} /></template>,
      );

      // then
      assert.dom(screen.queryByRole('button', { name: t('pages.modulix.issue-report.aria-label') })).doesNotExist();
    });
  });
});
