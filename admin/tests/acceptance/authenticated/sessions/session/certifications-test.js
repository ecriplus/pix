import { visit } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { currentURL } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import { authenticateAdminMemberWithRole } from '../../../../helpers/test-init';

module('Acceptance | authenticated/sessions/session/certifications', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  module('When user has role metier', function () {
    test('it should not show the publication button', async function (assert) {
      // given
      await authenticateAdminMemberWithRole({ isMetier: true })(server);
      server.create('session', { id: '1' });

      // when
      const screen = await visit('/sessions/1/certifications');

      // then
      assert.dom(screen.queryByText('Publier la session')).doesNotExist();
    });
  });

  module('When user has role certif', function () {
    test('the session can be published', async function (assert) {
      // given
      await authenticateAdminMemberWithRole({ isCertif: true })(server);

      const juryCertificationSummary = server.create('jury-certification-summary', {
        status: 'ok',
        isCancelled: false,
      });
      server.create('session', {
        id: '1',
        finalizedAt: '2020-01-01',
        publishedAt: null,
        status: 'finalized',
        juryCertificationSummaries: [juryCertificationSummary],
      });

      const screen = await visit('/sessions/1/certifications');

      this.server.get('/admin/sessions/:id', (schema, request) => {
        const sessionId = request.params.id;
        const session = schema.sessions.findBy({ id: sessionId });
        return session.update({ publishedAt: '2020-01-01' });
      });

      // when
      await click(screen.getByRole('button', { name: 'Publier la session' }));
      await screen.findByRole('dialog');
      await click(screen.getByRole('button', { name: 'Confirmer' }));

      // then
      assert.dom(await screen.queryByText('Publier la session')).doesNotExist();
      assert.dom(await screen.getByText('Dépublier la session')).exists();
    });
  });

  module('When requesting next page from pagination', function () {
    test('it should display next page jury certificate summary', async function (assert) {
      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);

      const juryCertificationSummaries = server.createList('jury-certification-summary', 11);
      server.create('session', {
        id: '1',
        juryCertificationSummaries,
      });

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

  module('When requesting page 2 of certification from url', function () {
    test('it should display page 2 jury certificate summary', async function (assert) {
      await authenticateAdminMemberWithRole({ isSuperAdmin: true })(server);

      const juryCertificationSummaries = server.createList('jury-certification-summary', 11);
      server.create('session', {
        id: '1',
        juryCertificationSummaries,
      });

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
