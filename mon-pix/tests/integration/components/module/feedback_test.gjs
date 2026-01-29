import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import ModulixFeedback from 'mon-pix/components/module/feedback';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { waitForDialog } from '../../../helpers/wait-for';

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
    assert.dom(screen.getByRole('status')).exists();
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

  test('should display report button', async function (assert) {
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
    assert.dom(screen.getByRole('button', { name: t('pages.modulix.issue-report.aria-label') })).exists();
  });

  module('when user clicks on report button', function () {
    test('should display issue-report modal with a form inside', async function (assert) {
      // given
      const feedback = {
        state: 'Correct !',
        diagnosis: "<p>C'est la bonne réponse !</p>",
      };

      // when
      const screen = await render(
        <template>
          <div id="modal-container"></div>
          <ModulixFeedback @answerIsValid={{true}} @feedback={{feedback}} />
        </template>,
      );
      await click(screen.getByRole('button', { name: t('pages.modulix.issue-report.aria-label') }));
      await waitForDialog();

      // then
      assert.dom(screen.getByRole('dialog')).exists();
      assert.dom(screen.getByRole('heading', { name: t('pages.modulix.issue-report.modal.title'), level: 1 })).exists();
    });
  });
});
