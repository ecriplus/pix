import { render } from '@1024pix/ember-testing-library';
import EmptyState from 'pix-orga/components/ui/empty-state';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Ui::EmptyState', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display a message telling if there is no participants', async function (assert) {
    // given
    const infoText = "Aucun participant pour l'instant !";
    const actionText = "L'administrateur doit importer la base élèves en cliquant sur le bouton importer.";

    //when
    const screen = await render(<template><EmptyState @infoText={{infoText}} @actionText={{actionText}} /></template>);

    //then
    assert.ok(screen.getByText("Aucun participant pour l'instant !"));
    assert.ok(screen.getByText("L'administrateur doit importer la base élèves en cliquant sur le bouton importer."));
  });
});
