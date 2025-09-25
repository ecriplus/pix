import { visit } from '@1024pix/ember-testing-library';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import authenticateSession from '../helpers/authenticate-session';
import setupIntl from '../helpers/setup-intl';
import { createPrescriberByUser, createUserManagingStudents } from '../helpers/test-init';

module('Acceptance | Combined course page', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(async function () {
    const user = createUserManagingStudents('ADMIN');
    createPrescriberByUser({ user });

    await authenticateSession(user.id);
  });

  test('it should display a combined course', async function (assert) {
    // given
    const combinedCourse = server.create('combined-course', {
      id: 2,
      code: 'AZERTY',
      name: 'Parcours Magimix',
      campaignIds: [123454],
    });

    // when
    const screen = await visit(`/parcours/${combinedCourse.id}`);

    // then

    assert.ok(await screen.getByRole('heading', { name: new RegExp(combinedCourse.name) }));
  });
});
