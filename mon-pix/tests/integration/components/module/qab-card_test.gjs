import { render } from '@1024pix/ember-testing-library';
import QabCard from 'mon-pix/components/module/element/qab/qab-card';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | QabCard', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when image is provided', function () {
    test('it should display a text and an image', async function (assert) {
      // given
      const card = _getQabCard();

      // when
      const screen = await render(<template><QabCard @card={{card}} /></template>);

      // then
      assert.ok(screen.getByText('Les boules de pétanques sont creuses.'));
      assert.ok(screen.getByRole('img', { name: card.image.altText }).hasAttribute('src', card.image.url));
    });

    module('when width and height are available', function () {
      test('should set them to the image', async function (assert) {
        // given
        const card = {
          ..._getQabCard(),
          image: {
            url: 'https://assets.pix.org/modules/bac-a-sable/boules-de-petanque.jpg',
            alt: 'alt text',
            information: {
              width: '300',
              height: '400',
            },
          },
        };
        const expectedWidth = Math.round(
          (QabCard.MAX_HEIGHT * card.image.information.width) / card.image.information.height,
        );

        // when
        const screen = await render(<template><QabCard @card={{card}} /></template>);

        // then
        assert.dom(screen.getByRole('img')).hasAttribute('height', QabCard.MAX_HEIGHT.toString());
        assert.dom(screen.getByRole('img')).hasAttribute('width', expectedWidth.toString());
      });
    });
  });

  module('when image is not provided', function () {
    test('it should not display an image', async function (assert) {
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
