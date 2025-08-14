import { clickByName, visit } from '@1024pix/ember-testing-library';
import { currentURL, waitUntil } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Acceptance | Module | Routes | navigateIntoTheModulePassage', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('when user arrive on the module passage page', function () {
    test('should display only the first lesson grain', async function (assert) {
      // given
      const sections = _createSections(server);

      server.create('module', {
        id: 'bien-ecrire-son-adresse-mail',
        slug: 'bien-ecrire-son-adresse-mail',
        title: 'Bien écrire son adresse mail',
        sections,
      });

      server.create('passage', {
        moduleId: 'bien-ecrire-son-adresse-mail',
      });

      // when
      const screen = await visit('/modules/bien-ecrire-son-adresse-mail/passage');

      // then
      assert.strictEqual(screen.getAllByRole('article').length, 1);
      assert.dom(screen.getByRole('button', { name: 'Continuer' })).exists({ count: 1 });
    });
  });

  module('when user click on continue button', function () {
    module('when the grain displayed is not the last', function () {
      test('should display the continue button', async function (assert) {
        // given
        const sections = _createSections(server);

        server.create('module', {
          id: 'bien-ecrire-son-adresse-mail',
          slug: 'bien-ecrire-son-adresse-mail',
          title: 'Bien écrire son adresse mail',
          sections,
        });

        // when
        const screen = await visit('/modules/bien-ecrire-son-adresse-mail/passage');

        // then
        assert.dom(screen.getByRole('button', { name: 'Continuer' })).exists({ count: 1 });

        // when
        await clickByName('Continuer');

        // then
        assert.dom(screen.getByRole('heading', { name: 'Étape 2 sur 3', level: 2 })).exists();
        assert.dom(screen.queryByRole('button', { name: 'Continuer' })).exists();
      });
    });

    module('when the grain displayed is the last', function () {
      test('should not display continue button', async function (assert) {
        // given
        const sections = _createSections(server);

        server.create('module', {
          id: 'bien-ecrire-son-adresse-mail',
          slug: 'bien-ecrire-son-adresse-mail',
          title: 'Bien écrire son adresse mail',
          sections,
        });

        // when
        const screen = await visit('/modules/bien-ecrire-son-adresse-mail/passage');

        // then
        assert.dom(screen.getByRole('button', { name: 'Continuer' })).exists({ count: 1 });

        // when
        await clickByName('Continuer');
        await clickByName('Continuer');

        // then
        assert.dom(screen.queryByRole('button', { name: 'Continuer' })).doesNotExist();
      });
    });

    test('should navigate to recap page when terminate is clicked', async function (assert) {
      // given
      const text1 = {
        id: 'elementId-1',
        type: 'text',
        content: 'content-1',
      };
      const section1 = server.create('section', {
        id: 'sectionId-1',
        type: 'blank',
        grains: [
          {
            id: 'grainId-1',
            title: 'title grain 1',
            components: [
              {
                type: 'element',
                element: text1,
              },
            ],
          },
        ],
      });
      const module = server.create('module', {
        id: 'bien-ecrire-son-adresse-mail',
        slug: 'bien-ecrire-son-adresse-mail',
        title: 'Bien écrire son adresse mail',
        sections: [section1],
      });
      server.create('passage', {
        id: '122',
        moduleId: module.slug,
      });

      // when
      const screen = await visit('/modules/bien-ecrire-son-adresse-mail/passage');

      // then
      assert.dom(screen.getByRole('button', { name: 'Terminer' })).exists({ count: 1 });

      // when
      await clickByName('Terminer');

      // then
      await waitUntil(() => {
        return screen.queryByRole('heading', { name: 'Module terminé !', level: 1 });
      });

      assert.strictEqual(currentURL(), '/modules/bien-ecrire-son-adresse-mail/recap');
    });
  });
});

const text1 = {
  id: 'elementId-1',
  type: 'text',
  content: 'content-1',
};

const text2 = {
  id: 'elementId-2',
  type: 'text',
  content: 'content-2',
};

const text3 = {
  id: 'elementId-3',
  type: 'text',
  content: 'content-3',
};
function _createSections(server) {
  const section1 = server.create('section', {
    id: 'sectionId-1',
    type: 'blank',
    grains: [
      {
        id: 'grainId-1',
        title: 'title grain 1',
        components: [
          {
            type: 'element',
            element: text1,
          },
        ],
      },
      {
        id: 'grainId-2',
        title: 'title grain 2',
        components: [
          {
            type: 'element',
            element: text2,
          },
        ],
      },
    ],
  });
  const section2 = server.create('section', {
    id: 'sectionId-2',
    type: 'blank',
    grains: [
      {
        id: 'grainId-3',
        title: 'title grain 3',
        components: [
          {
            type: 'element',
            element: text3,
          },
        ],
      },
    ],
  });

  return [section1, section2];
}
