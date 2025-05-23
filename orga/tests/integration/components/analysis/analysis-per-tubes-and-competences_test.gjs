import { render, within } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import AnalysisPerTubesAndCompetences from 'pix-orga/components/analysis/analysis-per-tubes-and-competences';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | analysis-per-tubes-and-competences', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('display analysis by competence and tubes', function () {
    test('it should display all table ', async function (assert) {
      // given
      const campaignAnalysisByTubesAndCompetence = {
        levelsPerCompetence: [
          {
            index: 1,
            name: 'mon super titre de competence 1',
            levelsPerTube: [],
          },
          {
            index: 2,
            name: 'mon super titre de competence 2',
            levelsPerTube: [],
          },
        ],
      };

      // when
      const screen = await render(
        <template><AnalysisPerTubesAndCompetences @data={{campaignAnalysisByTubesAndCompetence}} /></template>,
      );

      // then
      assert.ok(
        screen.getByRole('heading', {
          level: 2,
          name: t('components.analysis-per-tubes-and-competences.detailed-positioning.title'),
        }),
      );
      assert.ok(screen.getByText(t('components.analysis-per-tubes-and-competences.detailed-positioning.description')));
      assert.ok(screen.getByRole('table', { name: '1 - mon super titre de competence 1' }));
      assert.ok(screen.getByRole('table', { name: '2 - mon super titre de competence 2' }));
    });

    test('it should display content table', async function (assert) {
      // given
      const campaignAnalysisByTubesAndCompetence = {
        levelsPerCompetence: [
          {
            index: 1,
            name: 'mon super titre de competence 1',
            levelsPerTube: [
              { title: 'tube 1 cp 1', description: 'desc tube 1 cp 1', maxLevel: 8, meanLevel: 2 },
              { title: 'tube 2 cp 1', description: 'desc tube 2 cp 1', maxLevel: 4, meanLevel: 3.45 },
            ],
          },
          {
            index: 2,
            name: 'mon super titre de competence 2',
            levelsPerTube: [],
          },
        ],
      };

      // when
      const screen = await render(
        <template><AnalysisPerTubesAndCompetences @data={{campaignAnalysisByTubesAndCompetence}} /></template>,
      );

      // then
      const filledTable = within(screen.getByRole('table', { name: '1 - mon super titre de competence 1' }));
      assert.strictEqual(filledTable.getAllByRole('row').length, 3);

      assert.ok(
        filledTable.getByRole('columnheader', {
          name: t('components.analysis-per-tubes-and-competences.table.column.tubes'),
        }),
      );
      assert.ok(filledTable.getByRole('cell', { name: 'tube 1 cp 1 desc tube 1 cp 1' }));
      assert.ok(
        filledTable.getByRole('cell', {
          name: t('pages.statistics.gauge.label', { userLevel: 2, tubeLevel: 8 }),
        }),
      );
      assert.ok(filledTable.getByRole('cell', { name: t('pages.statistics.level.novice') }));

      assert.ok(filledTable.getByRole('cell', { name: 'tube 2 cp 1 desc tube 2 cp 1' }));
      assert.ok(
        filledTable.getByRole('cell', {
          name: t('pages.statistics.gauge.label', { userLevel: 3.5, tubeLevel: 4 }),
        }),
      );
      assert.ok(filledTable.getByRole('cell', { name: t('pages.statistics.level.independent') }));

      assert.ok(
        filledTable.getByRole('columnheader', {
          name: t('components.analysis-per-tubes-and-competences.table.column.positioning'),
        }),
      );
      assert.ok(
        filledTable.getByRole('columnheader', {
          name: t('components.analysis-per-tubes-and-competences.table.column.level'),
        }),
      );

      const emptyTable = within(screen.getByRole('table', { name: '2 - mon super titre de competence 2' }));
      assert.strictEqual(emptyTable.getAllByRole('row').length, 1);
    });
  });
});
