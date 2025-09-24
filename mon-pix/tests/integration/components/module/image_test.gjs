import { render } from '@1024pix/ember-testing-library';
import { click, findAll } from '@ember/test-helpers';
import ModulixImageElement from 'mon-pix/components/module/element/image';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Image', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display an image', async function (assert) {
    // given
    const url =
      'https://images.pix.fr/modulix/bien-ecrire-son-adresse-mail-explication-les-parties-dune-adresse-mail.svg';

    const imageElement = {
      url,
      alt: 'alt text',
      alternativeText: 'alternative instruction',
      legend: 'je suis une légende',
      licence: 'Je suis une licence',
    };

    //  when
    const screen = await render(<template><ModulixImageElement @image={{imageElement}} /></template>);

    // then
    assert.ok(screen);
    assert.strictEqual(findAll('.element-image').length, 1);
    const imgElement = screen.getByRole('img', { name: 'alt text' });
    assert.dom(imgElement).hasAttribute('src', url);
    assert.ok(screen.getByRole('button', { name: "Afficher l'alternative textuelle" }));
    assert.dom(screen.getByText(imageElement.legend)).exists();
    assert.dom(screen.getByText(imageElement.licence)).exists();
    assert.false(imgElement.hasAttribute('width'));
    assert.false(imgElement.hasAttribute('height'));
  });

  module('when width and height are available', function () {
    module('when image type is vector', function () {
      test('should extend width to 700px and height respecting aspect-ratio', async function (assert) {
        // given
        const url =
          'https://assets.pix.org/modules/bien-ecrire-son-adresse-mail-explication-les-parties-dune-adresse-mail.svg';

        const imageElement = {
          url,
          alt: 'alt text',
          alternativeText: 'alternative instruction',
          legend: 'je suis une légende',
          licence: 'Je suis une licence',
          infos: { width: 1920, height: 1280, type: 'vector' },
        };

        //  when
        const screen = await render(<template><ModulixImageElement @image={{imageElement}} /></template>);

        // then
        assert.ok(screen);
        assert.strictEqual(findAll('.element-image').length, 1);
        const imgElement = screen.getByRole('img', { name: 'alt text' });
        assert.dom(imgElement).hasAttribute('src', url);
        assert.dom(imgElement).hasAttribute('width', '700');
        const expectedHeight = Math.round(
          (ModulixImageElement.MAX_WIDTH * imageElement.infos.height) / imageElement.infos.width,
        );
        assert.dom(imgElement).hasAttribute('height', `${expectedHeight}`);
      });
    });

    module('when image type is raster', function () {
      test('should not set width and height', async function (assert) {
        // given
        const url =
          'https://assets.pix.org/modules/bien-ecrire-son-adresse-mail-explication-les-parties-dune-adresse-mail.png';

        const imageElement = {
          url,
          alt: 'alt text',
          alternativeText: 'alternative instruction',
          legend: 'je suis une légende',
          licence: 'Je suis une licence',
          infos: { width: 1920, height: 1280, type: 'raster' },
        };

        //  when
        const screen = await render(<template><ModulixImageElement @image={{imageElement}} /></template>);

        // then
        assert.ok(screen);
        assert.strictEqual(findAll('.element-image').length, 1);
        const imgElement = screen.getByRole('img', { name: 'alt text' });
        assert.dom(imgElement).hasAttribute('src', url);
        assert.false(imgElement.hasAttribute('width'));
        assert.false(imgElement.hasAttribute('height'));
      });
    });
  });

  test('should be able to use the modal for alternative instruction', async function (assert) {
    // given
    const alternativeText = 'alternative instruction';

    const imageElement = {
      url: 'https://images.pix.fr/modulix/bien-ecrire-son-adresse-mail-explication-les-parties-dune-adresse-mail.svg',
      alt: 'alt text',
      alternativeText,
    };
    const onImageAlternativeTextOpenStub = sinon.stub();

    //  when
    const screen = await render(
      <template>
        <ModulixImageElement @image={{imageElement}} @onAlternativeTextOpen={{onImageAlternativeTextOpenStub}} />
      </template>,
    );

    // then
    await click(screen.getByRole('button', { name: "Afficher l'alternative textuelle" }));
    assert.ok(await screen.findByRole('dialog'));
    assert.ok(screen.getByText(alternativeText));
    assert.ok(onImageAlternativeTextOpenStub.calledOnce);
  });

  test('should not be able to open the modal if there is no alternative instruction', async function (assert) {
    // given
    const imageElement = {
      url: 'https://images.pix.fr/modulix/bien-ecrire-son-adresse-mail-explication-les-parties-dune-adresse-mail.svg',
      alt: 'alt text',
      alternativeText: '',
    };

    //  when
    const screen = await render(<template><ModulixImageElement @image={{imageElement}} /></template>);

    // then
    const alternativeTextButton = await screen.queryByRole('button', { name: "Afficher l'alternative textuelle" });
    assert.dom(alternativeTextButton).doesNotExist();
  });
});
