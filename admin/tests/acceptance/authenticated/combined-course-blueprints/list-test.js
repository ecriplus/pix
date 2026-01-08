import { visit } from '@1024pix/ember-testing-library';
import { click, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { authenticateAdminMemberWithRole } from 'pix-admin/tests/helpers/test-init';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

import setupIntl from '../../../helpers/setup-intl';

module('Acceptance | Combined course blueprint | List', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(async function () {
    server.create('combined-course-blueprint', {
      id: 1,
      name: 'parcours IA',
      internalName: 'schéma de parcours IA',
      illsutration: 'https://image.pix.fr/ia.svg',
      description: "Un parcours sur l'IA pour le collège",
      content: [
        {
          type: 'evaluation',
          value: 1234,
        },
        {
          type: 'module',
          value: 'shasha',
        },
      ],
    });
    await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);
  });

  test('it should navigate to details combined course blueprint route', async function (assert) {
    // given
    const screen = await visit('/combined-course-blueprints/list');
    const link = screen.getByRole('link', { name: 'schéma de parcours IA' });

    // when
    await click(link);
    // then
    assert.strictEqual(currentURL(), '/combined-course-blueprints/1');
  });
});
