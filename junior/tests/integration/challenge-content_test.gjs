import { render } from '@1024pix/ember-testing-library';
import ChallengeContent from 'junior/components/challenge/challenge-content';
import { module, test } from 'qunit';

import { setupIntlRenderingTest, t } from '../helpers';

module('Integration | Component | challenge item', function (hooks) {
  const assessment = {};

  setupIntlRenderingTest(hooks);

  test('displays embed', async function (assert) {
    const challenge = { hasValidEmbedDocument: true, autoReply: true };
    await render(<template><ChallengeContent @challenge={{challenge}} @assessment={{assessment}} /></template>);

    assert.dom('.challenge-item__embed').exists();
    assert.dom('.challenge-item__web-component').doesNotExist();
  });

  test('displays web component', async function (assert) {
    const challenge = { hasWebComponent: true };
    await render(<template><ChallengeContent @challenge={{challenge}} @assessment={{assessment}} /></template>);

    assert.dom('.challenge-item__web-component').exists();
    assert.dom('.challenge-item__embed').doesNotExist();
  });

  test('displays image', async function (assert) {
    const challenge = { hasValidEmbedDocument: false, autoReply: false, illustrationUrl: 'https://pix.fr' };
    await render(<template><ChallengeContent @challenge={{challenge}} @assessment={{assessment}} /></template>);

    assert.dom('.challenge-item__image').exists();
  });

  test('displays qroc', async function (assert) {
    const challenge = { hasValidEmbedDocument: false, autoReply: false, isQROC: true, proposals: 'number' };
    await render(<template><ChallengeContent @challenge={{challenge}} @assessment={{assessment}} /></template>);

    assert.dom('.challenge-item__qrocm').exists();
  });

  test('displays qrocm', async function (assert) {
    const challenge = { hasValidEmbedDocument: false, autoReply: false, isQROCM: true, proposals: 'number' };
    await render(<template><ChallengeContent @challenge={{challenge}} @assessment={{assessment}} /></template>);

    assert.dom('.challenge-item__qrocm').exists();
  });

  test('displays qcu', async function (assert) {
    const challenge = { hasValidEmbedDocument: false, autoReply: false, isQCU: true };
    await render(<template><ChallengeContent @challenge={{challenge}} @assessment={{assessment}} /></template>);

    assert.dom('.challenge-item__qcu').exists();
  });

  test('displays qcm', async function (assert) {
    const challenge = { hasValidEmbedDocument: false, autoReply: false, isQCM: true };
    await render(<template><ChallengeContent @challenge={{challenge}} @assessment={{assessment}} /></template>);

    assert.dom('.challenge-item__qcm').exists();
  });

  test('displays image, embed and qroc', async function (assert) {
    const challenge = {
      hasValidEmbedDocument: true,
      autoReply: false,
      illustrationUrl: 'https://pix.fr',
      isQROC: true,
      proposals: 'number',
    };

    await render(<template><ChallengeContent @challenge={{challenge}} @assessment={{assessment}} /></template>);

    assert.dom('.challenge-item__image').exists();
    assert.dom('.challenge-item__embed').exists();
    assert.dom('.challenge-item__qrocm').exists();
  });

  test('displays lesson', async function (assert) {
    const challenge = {
      hasValidEmbedDocument: true,
      autoReply: false,
      focused: true,
    };
    const screen = await render(
      <template><ChallengeContent @challenge={{challenge}} @assessment={{assessment}} /></template>,
    );

    assert.dom(screen.getByRole('button', { name: t('pages.challenge.actions.continue') })).exists();
    assert.dom(screen.queryByRole('button', { name: t('pages.challenge.actions.skip') })).doesNotExist();
  });
});
