import { render, within } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import AnalysisPerCompetence from 'pix-orga/components/analysis/analysis-per-competence';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | analysis-per-competence', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('display analysis by tube', function () {
    test('it should display content table', async function (assert) {
      // given
      const campaignAnalysisByTubesAndCompetence = {
        levelsPerCompetence: [
          {
            index: '3.2',
            name: 'Développer des documents multimedia',
            description: 'Développer des documents à contenu multimédia pour créer ses propres productions multimédia',
            maxLevel: 3,
            meanLevel: 1.1,
          },
          {
            index: '3.3',
            name: 'Sécuriser ses documents',
            description: 'Sécuriser ses documents efficacement',
            maxLevel: 5,
            meanLevel: 3,
          },
        ],
      };

      // when
      const screen = await render(
        <template><AnalysisPerCompetence @data={{campaignAnalysisByTubesAndCompetence}} /></template>,
      );

      // then
      const filledTable = within(
        screen.getByRole('table', { name: t('components.analysis-per-competence.table.caption') }),
      );

      assert.strictEqual(filledTable.getAllByRole('row').length, 3);

      assert.ok(
        filledTable.getByRole('columnheader', {
          name: t('components.analysis-per-competence.table.column.competences'),
        }),
      );
      assert.ok(
        filledTable.getByRole('columnheader', {
          name: t('components.analysis-per-competence.table.column.level'),
        }),
      );
      assert.ok(
        filledTable.getByRole('columnheader', {
          name: t('components.analysis-per-competence.table.column.positioning'),
        }),
      );

      assert.ok(
        filledTable.getByRole('cell', {
          name: '3.2 - Développer des documents multimedia Développer des documents à contenu multimédia pour créer ses propres productions multimédia',
        }),
      );

      assert.ok(
        filledTable.getByRole('cell', {
          name: t('components.analysis-per-competence.cover-rate-gauge-label', {
            reachedLevel: 1.1,
            maxLevel: 3,
          }),
        }),
      );

      assert.ok(
        filledTable.getByRole('cell', {
          name: t('pages.statistics.level.novice'),
        }),
      );
    });
  });
});
