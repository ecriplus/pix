import { render } from '@1024pix/ember-testing-library';
import CertificationInformations from 'pix-admin/components/certifications/certification/informations';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Certifications | Certification | Informations', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  test('should display the global actions block', async function (assert) {
    // given
    const certification = store.createRecord('certification', { userId: 1, competencesWithMark: [] });
    const session = store.createRecord('session', { id: 7404 });

    // when
    const screen = await render(
      <template><CertificationInformations @certification={{certification}} @session={{session}} /></template>,
    );

    // then
    assert.dom(screen.getByRole('link', { name: "Voir les détails de l'utilisateur" })).exists();
  });
  test('should display certification state card', async function (assert) {
    // given
    const certification = store.createRecord('certification', { competencesWithMark: [] });
    const session = store.createRecord('session', { id: 7404 });

    // when
    const screen = await render(
      <template><CertificationInformations @certification={{certification}} @session={{session}} /></template>,
    );

    // then
    assert.dom(screen.getByRole('heading', { name: 'État' })).exists();
  });
});
