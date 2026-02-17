import { visit, within } from '@1024pix/ember-testing-library';
import { click, find } from '@ember/test-helpers';
import { module, test } from 'qunit';

import { setupApplicationTest, t } from '../helpers';

module('Acceptance | Displaying a QCM Image challenge', function (hooks) {
  setupApplicationTest(hooks);
  let assessment;

  hooks.beforeEach(async function () {
    assessment = this.server.create('assessment');
    this.server.create('challenge', 'QCM_Image');
  });

  test('should display answer feedback bubble if the user clicks on the correct answer', async function (assert) {
    // when
    const screen = await visit(`/assessments/${assessment.id}/challenges`);
    const imageQuiz = within(find('image-quiz').shadowRoot);

    await click(imageQuiz.getByRole('option', { name: 'Choix1' }));
    await click(imageQuiz.getByRole('option', { name: 'Choix2' }));
    await click(screen.getByRole('button', { name: t('pages.challenge.actions.check') }));

    // then
    assert.dom(screen.getByText(t('pages.challenge.messages.correct-answer'))).exists();
  });

  test('should display answer feedback bubble if the user clicks on the wrong answer', async function (assert) {
    // when
    const screen = await visit(`/assessments/${assessment.id}/challenges`);
    const imageQuiz = within(find('image-quiz').shadowRoot);

    await click(imageQuiz.getByRole('option', { name: 'Choix1' }));
    await click(imageQuiz.getByRole('option', { name: 'bad-answer' }));
    await click(screen.getByRole('button', { name: t('pages.challenge.actions.check') }));

    // then
    assert.dom(screen.getByText(t('pages.challenge.messages.wrong-answer'))).exists();
  });
});
