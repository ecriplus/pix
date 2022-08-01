import sinon from 'sinon';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import EmberObject from '@ember/object';
import Service from '@ember/service';
import createGlimmerComponent from '../../helpers/create-glimmer-component';

module('Unit | Component | competence-card-default ', function (hooks) {
  setupTest(hooks);

  module('#improveCompetenceEvaluation', function () {
    const competenceId = 'recCompetenceId';
    const userId = 'userId';
    const scorecardId = 'scorecardId';
    const scorecard = EmberObject.create({ competenceId, id: scorecardId });
    let competenceEvaluation, component;

    test('calls competenceEvaluation service for improving', async function (assert) {
      // given
      component = createGlimmerComponent('component:competence-card-default', { scorecard });
      competenceEvaluation = Service.create({ improve: sinon.stub() });
      component.currentUser = EmberObject.create({ user: { id: userId } });
      component.competenceEvaluation = competenceEvaluation;

      // when
      await component.improveCompetenceEvaluation();

      // then
      assert.expect(0);
      sinon.assert.calledWith(competenceEvaluation.improve, { userId, competenceId, scorecardId });
    });
  });

  module('#shouldWaitBeforeImproving', function (hooks) {
    let component, scorecard;

    hooks.beforeEach(() => {
      const competenceId = 'recCompetenceId';
      scorecard = EmberObject.create({ competenceId });
      component = createGlimmerComponent('component:competence-card-default', { scorecard, interactive: true });
    });

    test('should return true when remaining days before improving are different than 0', function (assert) {
      // given
      scorecard.remainingDaysBeforeImproving = 3;

      // when
      const result = component.shouldWaitBeforeImproving;

      // then
      assert.true(result);
    });

    test('should return false when remaining days before improving are equal to 0', function (assert) {
      // given
      scorecard.remainingDaysBeforeImproving = 0;

      // when
      const result = component.shouldWaitBeforeImproving;

      // then
      assert.false(result);
    });
  });
});
