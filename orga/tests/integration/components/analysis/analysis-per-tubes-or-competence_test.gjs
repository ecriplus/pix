import { clickByName, render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import AnalysisPerTubeOrCompetence from 'pix-orga/components/analysis/analysis-per-tube-or-competence';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | analysis-per-tube-or-competence', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should toggle the view between tubes and competences', async function (assert) {
    // given
    const campaignAnalysisByTubesAndCompetence = {};

    // when
    const screen = await render(
      <template><AnalysisPerTubeOrCompetence @data={{campaignAnalysisByTubesAndCompetence}} /></template>,
    );

    // then
    assert.ok(screen.getByText(t('components.analysis-per-tube.description')));

    clickByName(t('components.analysis-per-tube-or-competence.toggle.label'));

    assert.ok(await screen.findByText(t('components.analysis-per-competence.description')));

    clickByName(t('components.analysis-per-tube-or-competence.toggle.label'));

    assert.ok(await screen.findByText(t('components.analysis-per-tube.description')));
  });
});
