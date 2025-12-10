import { render } from '@1024pix/ember-testing-library';
import { setupRenderingTest } from 'ember-qunit';
import SessionCandidates from 'pix-admin/components/sessions/session/session-candidates';
import { SUBSCRIPTION_TYPES } from 'pix-admin/models/subscription';
import { module, test } from 'qunit';

import setupIntl from '../../../../helpers/setup-intl';

module('Integration | Component | Sessions | Session | SessionCandidates', function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  let store;

  hooks.beforeEach(async function () {
    this.intl = this.owner.lookup('service:intl');
    store = this.owner.lookup('service:store');
  });

  test('it should display candidate with only a core subscription', async function (assert) {
    // given
    const coreSubscription = store.createRecord('subscription', {
      type: SUBSCRIPTION_TYPES.CORE,
    });
    const candidate = _buildCertificationCandidate({
      subscriptions: [coreSubscription],
    });
    const certificationCandidates = [store.createRecord('certification-candidate', candidate)];

    // when
    const screen = await render(
      <template><SessionCandidates @certificationCandidates={{certificationCandidates}} /></template>,
    );

    // then
    assert
      .dom(screen.getByRole('cell', { name: this.intl.t('pages.sessions.candidates.subscriptions.core') }))
      .exists();
  });

  test('it should display candidate with only a complementary subscription', async function (assert) {
    // given
    const complementaryCertificationKey = 'pix-certif-1';
    const complementarySubscription = store.createRecord('subscription', {
      type: SUBSCRIPTION_TYPES.COMPLEMENTARY,
      complementaryCertificationKey,
    });
    const candidate = _buildCertificationCandidate({
      subscriptions: [complementarySubscription],
    });
    const certificationCandidates = [store.createRecord('certification-candidate', candidate)];

    // when
    const screen = await render(
      <template><SessionCandidates @certificationCandidates={{certificationCandidates}} /></template>,
    );

    // then
    assert
      .dom(
        screen.getByRole('cell', {
          name: this.intl.t('pages.sessions.candidates.subscriptions.complementary', {
            complementaryCertificationKey,
          }),
        }),
      )
      .exists();
  });

  test('it should display candidate with a double subscription', async function (assert) {
    // given
    const complementaryCertificationKey = 'pix-certif-1';
    const complementarySubscription = store.createRecord('subscription', {
      type: SUBSCRIPTION_TYPES.COMPLEMENTARY,
      complementaryCertificationKey,
    });
    const coreSubscription = store.createRecord('subscription', {
      type: SUBSCRIPTION_TYPES.CORE,
    });
    const candidate = _buildCertificationCandidate({
      subscriptions: [complementarySubscription, coreSubscription],
    });

    const certificationCandidates = [store.createRecord('certification-candidate', candidate)];

    // when
    const screen = await render(
      <template><SessionCandidates @certificationCandidates={{certificationCandidates}} /></template>,
    );

    // then
    assert
      .dom(
        screen.getByRole('cell', {
          name: this.intl.t('pages.sessions.candidates.subscriptions.complementary', {
            complementaryCertificationKey,
          }),
        }),
      )
      .exists();
  });
});

function _buildCertificationCandidate({
  id = '12345',
  firstName = 'Eddy',
  lastName = 'Taurial',
  email = 'eddy.taurial@example.com',
  subscriptions = [],
}) {
  return {
    id,
    firstName,
    lastName,
    email,
    subscriptions,
  };
}
