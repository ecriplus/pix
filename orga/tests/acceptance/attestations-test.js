import { clickByName, fillByLabel, visit, within } from '@1024pix/ember-testing-library';
import { click, currentURL } from '@ember/test-helpers';
import setupMirage from 'ember-cli-mirage/test-support/setup-mirage';
import { t } from 'ember-intl/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { module, test } from 'qunit';

import authenticateSession from '../helpers/authenticate-session';
import setupIntl from '../helpers/setup-intl';
import {
  createPrescriberByUser,
  createUserMembershipWithRole,
  createUserWithMembershipAndTermsOfServiceAccepted,
} from '../helpers/test-init';

module('Acceptance | Attestations', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(() => {});

  test('it should not be accessible by an unauthenticated user', async function (assert) {
    // when
    await visit('/attestations');

    // then
    assert.strictEqual(currentURL(), '/connexion');
  });

  module('when the prescriber is authenticated', (hooks) => {
    hooks.beforeEach(async () => {
      const user = createUserMembershipWithRole('ADMIN');
      server.create('member-identity', { id: user.id, firstName: user.firstName, lastName: user.lastName });
      server.create('attestation-participant-status', {
        firstName: 'Jean',
        lastName: 'LastName1',
        obtainedAt: null,
        division: '6eme',
      });
      server.create('attestation-participant-status', {
        firstName: 'Eude',
        lastName: 'LastName2',
        obtainedAt: '2024-01-01',
        division: '5eme',
      });
      const prescriber = createPrescriberByUser({ user });
      prescriber.features = {
        ...prescriber.features,
        ATTESTATIONS_MANAGEMENT: { active: true, params: ['SIXTH_GRADE'] },
      };
      await authenticateSession(user.id);
    });

    hooks.afterEach(function () {});

    test('it should be accessible for an authenticated prescriber', async function (assert) {
      // when
      await visit('/attestations');

      // then
      assert.strictEqual(currentURL(), '/attestations');
    });
  });
});
