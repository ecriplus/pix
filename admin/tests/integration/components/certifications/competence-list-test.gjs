import { render, within } from '@1024pix/ember-testing-library';
import CompetenceList from 'pix-admin/components/certifications/competence-list';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | certifications/competence-list', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display an entry per competence', async function (assert) {
    // given
    const competences = [
      { index: '1.1', score: '30', level: '3' },
      { index: '2.1', score: '20', level: '2' },
      { index: '5.2', score: '10', level: '1' },
    ];

    // when
    const screen = await render(
      <template><CompetenceList @competences={{competences}} @shouldDisplayPixScore={{true}} /></template>,
    );

    // then
    const table = screen.getByRole('table', { name: 'Détails du résultat par compétence' });
    const rows = await within(table).findAllByRole('row');

    assert.dom(within(rows[0]).getByRole('columnheader', { name: 'Compétence' })).exists();
    assert.dom(within(rows[0]).getByRole('columnheader', { name: 'Score' })).exists();
    assert.dom(within(rows[0]).getByRole('columnheader', { name: 'Niveau' })).exists();

    assert.dom(within(rows[1]).getByRole('cell', { name: '1.1' })).exists();
    assert.dom(within(rows[1]).getByRole('cell', { name: '30' })).exists();
    assert.dom(within(rows[1]).getByRole('cell', { name: '3' })).exists();

    assert.dom(within(rows[2]).getByRole('cell', { name: '2.1' })).exists();
    assert.dom(within(rows[2]).getByRole('cell', { name: '20' })).exists();
    assert.dom(within(rows[2]).getByRole('cell', { name: '2' })).exists();

    assert.dom(within(rows[3]).getByRole('cell', { name: '5.2' })).exists();
    assert.dom(within(rows[3]).getByRole('cell', { name: '10' })).exists();
    assert.dom(within(rows[3]).getByRole('cell', { name: '1' })).exists();
  });

  test('it should display competence index, score and level', async function (assert) {
    // given
    const competences = [{ index: '1.1', score: '30', level: '3' }];

    // when
    const screen = await render(
      <template><CompetenceList @competences={{competences}} @shouldDisplayPixScore={{true}} /></template>,
    );

    // then
    const table = screen.getByRole('table', { name: 'Détails du résultat par compétence' });
    const rows = await within(table).findAllByRole('row');

    assert.dom(within(table).getByRole('columnheader', { name: 'Compétence' })).exists();
    assert.dom(within(table).getByRole('columnheader', { name: 'Score' })).exists();
    assert.dom(within(table).getByRole('columnheader', { name: 'Niveau' })).exists();
    assert.dom(within(rows[1]).getByRole('cell', { name: '1.1' })).exists();
    assert.dom(within(rows[1]).getByRole('cell', { name: '30' })).exists();
    assert.dom(within(rows[1]).getByRole('cell', { name: '3' })).exists();
  });

  module('when certification is V3', function () {
    test('it should not display competence scores', async function (assert) {
      // given
      const competences = [{ index: '1.1', score: '0', level: '3' }];

      // when
      const screen = await render(
        <template><CompetenceList @competences={{competences}} @shouldDisplayPixScore={{false}} /></template>,
      );

      // then
      const table = screen.getByRole('table', { name: 'Détails du résultat par compétence' });
      const rows = await within(table).findAllByRole('row');

      assert.dom(within(rows[0]).getByRole('columnheader', { name: 'Compétence' })).exists();
      assert.dom(within(rows[0]).getByRole('columnheader', { name: 'Niveau' })).exists();

      assert.dom(within(rows[1]).getByRole('cell', { name: '1.1' })).exists();
      assert.dom(within(rows[1]).getByRole('cell', { name: '3' })).exists();

      assert.dom(screen.queryByText('Score')).doesNotExist();
      assert.dom(screen.queryByText('O')).doesNotExist();
    });
  });
});
