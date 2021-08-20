import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';
import { setupIntl, t } from 'ember-intl/test-support';

module('Integration | Component | Participant::Assessment::Results', function(hooks) {
  setupIntlRenderingTest(hooks);
  setupIntl(hooks);

  let store;

  hooks.beforeEach(function() {
    store = this.owner.lookup('service:store');
  });

  test('it should display a sentence when displayResults is false', async function(assert) {
    // when
    await render(hbs`<Participant::Assessment::Results @displayResults={{false}} />`);

    // then
    assert.contains('En attente de résultats');
  });

  test('it should display results when displayResults is true', async function(assert) {
    // given
    const competenceResult = store.createRecord('campaignAssessmentParticipationCompetenceResult', {
      name: 'Compétence 1',
      index: '1.1',
      areaColor: 'jaffa',
      competenceMasteryRate: 0.50,
    });

    const campaignAssessmentParticipationResult = store.createRecord('campaignAssessmentParticipationResult', {
      competenceResults: [competenceResult],
    });

    this.set('campaignAssessmentParticipationResult', campaignAssessmentParticipationResult);

    // when
    await render(hbs`<Participant::Assessment::Results @results={{campaignAssessmentParticipationResult}} @displayResults={{true}} />`);

    // then
    assert.dom(`[aria-label="${t('pages.assessment-individual-results.table.title')}"]`).exists({ count: 1 });
    assert.dom(`[aria-label="${t('pages.assessment-individual-results.table.title')}"]`).containsText('Compétence 1');
    assert.dom(`[aria-label="${t('pages.assessment-individual-results.table.title')}"]`).containsText('50 %');
  });
});
