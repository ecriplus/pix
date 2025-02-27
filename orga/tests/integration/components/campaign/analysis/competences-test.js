import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Campaign::Analysis::Competences', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  test('it should display the collective result list of the campaign', async function (assert) {
    // given
    const campaignCompetenceCollectiveResult = store.createRecord('campaign-competence-collective-result', {
      id: '1_recCompA',
      areaCode: '1',
      areaColor: 'jaffa',
      competenceId: 'recCompA',
      competenceName: 'Competence A',
      averageValidatedSkills: 10,
      targetedSkillsCount: 30,
    });

    const campaignCollectiveResult = store.createRecord('campaign-collective-result', {
      id: '1',
      campaignCompetenceCollectiveResults: [campaignCompetenceCollectiveResult],
    });

    this.set('campaignCollectiveResult', campaignCollectiveResult);

    // when
    const screen = await render(
      hbs`<Campaign::Analysis::Competences @campaignCollectiveResult={{this.campaignCollectiveResult}} />`,
    );

    // then
    const firstCompetence = screen.getAllByRole('row')[1];
    assert.dom(firstCompetence).containsText('Competence A');
    assert.dom(firstCompetence).containsText('33%');
  });
});
