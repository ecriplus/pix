import { module, test } from 'qunit';
import { render } from '@1024pix/ember-testing-library';

import Organizations from "pix-admin/templates/authenticated/trainings/training/target-profiles/organizations";
import setupIntlRenderingTest from "../../../../../../helpers/setup-intl-rendering";

module('Integration | Templates | Authenticated | Trainings | Training | Target Profiles | Organizations', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display organizations', async function(assert) {
    // given
    const store = this.owner.lookup('service:store');
    const targetProfile = store.createRecord('target-profile', { internalName: 'Profil cible 1' });
    const organization = store.createRecord('organization', {
      id: 'org1',
      name: 'Organisation 1',
      type: 'Type A',
      externalId: 'ext-org1',
    });
    const model = {
      targetProfile,
      organizations: [organization],
    };

    // when
    const screen = await render(
      <template><Organizations @model={{model}} /></template>,
    );

    // then
    assert.dom(screen.getByRole('heading', { name: 'Profil cible 1' })).exists();
    assert.dom(screen.getByRole('heading', { name: 'Filtrer par organisations' })).exists();
    assert.dom(screen.getByRole('cell', { name: 'Organisation 1' })).exists();
  });
});
