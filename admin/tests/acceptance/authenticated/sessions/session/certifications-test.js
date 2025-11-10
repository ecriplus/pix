import { visit } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'pix-admin/tests/test-support/setup-mirage';
import { module, test } from 'qunit';

import { authenticateAdminMemberWithRole } from '../../../../helpers/test-init';

module('Acceptance | authenticated/sessions/session/certifications', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  let session, juryCertificationSummaries;

  hooks.beforeEach(async function () {
    await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);

    juryCertificationSummaries = server.createList('jury-certification-summary', 11);

    session = server.create('session', 'finalized', {
      id: '1',
      juryCertificationSummaries,
    });
  });

  module('When the session is finalized', function () {
    module('When the session is not published', function () {
      test('it should be possible to publish the session', async function (assert) {
        // given
        session.update({
          publishedAt: null,
        });

        // when
        const screen = await visit('/sessions/1/certifications');
        click(screen.getByRole('button', { name: 'Publier la session' }));
        click(await screen.findByRole('button', { name: 'Confirmer' }));

        assert.dom(await screen.findByRole('button', { name: 'Dépublier la session' })).exists();
      });
    });

    module('When the session is published', function () {
      test('it should be possible to unpublish the session', async function (assert) {
        // given
        session.update({
          publishedAt: new Date(),
        });

        // when
        const screen = await visit('/sessions/1/certifications');
        click(screen.getByRole('button', { name: 'Dépublier la session' }));
        click(await screen.findByRole('button', { name: 'Confirmer' }));

        assert.dom(await screen.findByRole('button', { name: 'Publier la session' })).exists();
      });
    });
  });

  // TODO : move to Certifications::List component integration level
  module('When requesting next page from pagination', function () {
    test('it should display next page jury certificate summary', async function (assert) {
      // when
      const screen = await visit('/sessions/1/certifications');
      await click(screen.getByRole('button', { name: 'Aller à la page suivante' }));

      // then
      assert.strictEqual(currentURL(), '/sessions/1/certifications?pageNumber=2');
      const lastSummary = juryCertificationSummaries.at(-1);
      assert.dom(screen.queryByText(lastSummary.id)).exists();
      const numberOfLineForHeadAndBody = 2;
      assert.strictEqual(screen.queryAllByRole('row').length, numberOfLineForHeadAndBody);
    });
  });

  // TODO : move to Certifications::List component integration level
  module('When requesting page 2 of certification from url', function () {
    test('it should display page 2 jury certificate summary', async function (assert) {
      // when
      const screen = await visit('/sessions/1/certifications?pageNumber=2&pageSize=10');

      // then
      const lastSummary = juryCertificationSummaries.at(-1);
      assert.dom(screen.queryByText(lastSummary.id)).exists();
      const numberOfLineForHeadAndBody = 2;
      assert.strictEqual(screen.queryAllByRole('row').length, numberOfLineForHeadAndBody);
    });
  });
});
