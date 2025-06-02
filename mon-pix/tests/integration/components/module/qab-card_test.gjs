import { render } from '@1024pix/ember-testing-library';
import QabCard from 'mon-pix/components/module/element/qab/qab-card';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | QabCard', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display a text and an image', async function (assert) {
    // given
    const card = _getQabCard();

    // when
    const screen = await render(<template><QabCard @card={{card}} /></template>);

    // then
    assert.ok(screen.getByText('Les boules de pétanques sont creuses.'));
    assert.ok(screen.getByRole('img', { name: card.image.altText }).hasAttribute('src', card.image.url));
  });

  test('it should not display an image when there is no image url', async function (assert) {
    // given
    const card = {
      ..._getQabCard(),
      image: {
        url: '',
        alt: 'alt text',
      },
    };

    // when
    const screen = await render(<template><QabCard @card={{card}} /></template>);

    // then
    assert.notOk(screen.queryByRole('img'));
  });

  module('when status is success', function () {
    test('should display a correct answer alert', async function (assert) {
      // given
      const card = _getQabCard();
      const status = 'success';

      // when
      const screen = await render(<template><QabCard @card={{card}} @status={{status}} /></template>);

      // then
      assert.dom(screen.getByRole('status')).hasText('Bonne réponse !');
    });
  });

  module('when status is error', function () {
    test('should display an incorrect answer alert', async function (assert) {
      // given
      const card = _getQabCard();
      const status = 'error';

      // when
      const screen = await render(<template><QabCard @card={{card}} @status={{status}} /></template>);

      // then
      assert.dom(screen.getByRole('status')).hasText('Mauvaise réponse.');
    });
  });

  function _getQabCard() {
    return {
      id: 'e222b060-7c18-4ee2-afe2-2ae27c28946a',
      image: {
        url: 'https://assets.pix.org/modules/bac-a-sable/boules-de-petanque.jpg',
        altText: 'alt text',
      },
      text: 'Les boules de pétanques sont creuses.',
    };
  }
});
