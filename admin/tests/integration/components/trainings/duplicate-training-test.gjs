import { clickByText, render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import DuplicateTraining from 'pix-admin/components/trainings/duplicate-training';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Trainings | Duplicate training', function (hooks) {
  setupIntlRenderingTest(hooks);

  const duplicateTraining = sinon.stub().resolves(true);

  test('it should render the duplicate training modal', async function (assert) {
    // when
    const screen = await render(<template><DuplicateTraining @onSubmit={{duplicateTraining}} /></template>);
    const duplicateButton = screen.getByRole('button', { name: 'Dupliquer ce contenu formatif' });
    await click(duplicateButton);

    // then
    assert.dom(await screen.findByText('Dupliquer le contenu formatif ?')).exists();
    assert.dom(screen.getByText('Cette action dupliquera le contenu formatif avec ses déclencheurs.')).exists();
    assert.dom(await screen.findByRole('button', { name: 'Valider' })).exists();
    assert.dom(screen.getByRole('button', { name: 'Annuler' })).exists();
    assert.dom(screen.getByRole('button', { name: 'Fermer' })).exists();
  });

  test('it should call the duplicate method on click on submit', async function (assert) {
    await render(<template><DuplicateTraining @onSubmit={{duplicateTraining}} /></template>);

    // when
    await clickByText('Valider');

    // then
    sinon.assert.calledOnce(duplicateTraining);
    assert.ok(true);
  });
});
