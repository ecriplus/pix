import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import AnalysisHeader from 'pix-orga/components/analysis/analysis-header';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | analysis-header', function (hooks) {
  setupIntlRenderingTest(hooks);
  hooks.afterEach(function () {
    sinon.restore();
  });
  test('it should navigate the competences view', async function (assert) {
    // given
    const router = this.owner.lookup('service:router');
    sinon.stub(router, 'currentRouteName').value('authenticated.campaigns.campaign.analysis.tubes');
    sinon.stub(router, 'transitionTo').resolves();
    // when
    const screen = await render(<template><AnalysisHeader /></template>);

    // then
    await click(screen.getByLabelText(t('components.analysis-per-tube-or-competence.toggle.label')));
    assert.ok(router.transitionTo.calledOnceWithExactly('authenticated.campaigns.campaign.analysis.competences'));
  });

  test('it should navigate the tubes view', async function (assert) {
    // given
    const router = this.owner.lookup('service:router');
    sinon.stub(router, 'currentRouteName').value('authenticated.campaigns.campaign.analysis.competences');
    sinon.stub(router, 'transitionTo').resolves();

    // when
    const screen = await render(<template><AnalysisHeader /></template>);

    // then
    await click(screen.getByLabelText(t('components.analysis-per-tube-or-competence.toggle.label')));
    assert.ok(router.transitionTo.calledOnceWithExactly('authenticated.campaigns.campaign.analysis.tubes'));
  });
});
