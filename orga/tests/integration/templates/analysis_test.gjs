import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import Analysis from 'pix-orga/templates/authenticated/campaigns/campaign/analysis';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Template | analysis', function (hooks) {
  setupIntlRenderingTest(hooks);
  const model = {
    campaign: {
      hasSharedParticipations: true,
    },
    isNewPage: true,
  };

  module('display analysis', function () {
    test('it should display new page description', async function (assert) {
      // given
      const screen = await render(<template><Analysis @model={{model}} /></template>);

      // then
      assert.ok(screen.getByText(t('pages.campaign-analysis.description.resume')));
      assert.ok(screen.getByText(t('pages.campaign-analysis.description.explanation')));
      assert.ok(screen.getByText(t('pages.campaign-analysis.description.nota-bene')));
      assert.ok(screen.getByText(t('pages.campaign-analysis.levels-correspondence.levels.beginner')));
      assert.ok(screen.getByText(t('pages.campaign-analysis.levels-correspondence.levels.independent')));
      assert.ok(screen.getByText(t('pages.campaign-analysis.levels-correspondence.levels.advanced')));
      assert.ok(screen.getByText(t('pages.campaign-analysis.levels-correspondence.levels.expert')));
      assert.ok(screen.getByRole('link', { name: t('pages.campaign-analysis.levels-correspondence.infos.text') }));
    });
  });
});
