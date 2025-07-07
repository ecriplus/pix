import EmberService from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | Assessments | Challenge', function (hooks) {
  setupTest(hooks);

  let route;
  let storeStub;
  let createRecordStub;
  let queryRecordStub;
  let findRecordStub;
  let currentUserStub;

  const params = {
    challenge_number: 0,
  };

  const assessment = {
    id: 'assessment_id',
    get: sinon.stub().callsFake(() => 'ASSESSMENT_TYPE'),
    type: 'PLACEMENT',
    orderedChallengeIdsAnswered: [],
  };

  const model = {
    assessment,
    challenge: {
      id: 'challenge_id',
    },
  };

  hooks.beforeEach(function () {
    createRecordStub = sinon.stub();
    queryRecordStub = sinon.stub();
    findRecordStub = sinon.stub();
    storeStub = EmberService.create({
      createRecord: createRecordStub,
      queryRecord: queryRecordStub,
      findRecord: findRecordStub,
    });

    route = this.owner.lookup('route:assessments.challenge');
    currentUserStub = { user: { firstName: 'John', lastname: 'Doe' } };
    route.currentUser = currentUserStub;
    route.store = storeStub;
    route.router = { transitionTo: sinon.stub() };
    route.modelFor = sinon.stub().returns(assessment);
  });

  module('#model', function () {
    module('when accessing an already answered challenge', function () {
      test('should correctly call the store to find assessment and challenge', async function (assert) {
        // given
        model.assessment.orderedChallengeIdsAnswered = ['challengeABCDEF'];
        findRecordStub.withArgs('challenge', 'challengeABCDEF').resolves({
          id: 'challengeABCDEF',
        });
        const answer = Symbol('answer');
        queryRecordStub
          .withArgs('answer', { assessmentId: model.assessment.id, challengeId: 'challengeABCDEF' })
          .resolves(answer);

        // when
        const returnedModel = await route.model(params);

        // then
        sinon.assert.calledWith(route.modelFor, 'assessments');
        sinon.assert.calledOnce(findRecordStub);
        assert.strictEqual(returnedModel.answer, answer);
      });
    });

    module('when accessing next challenge', function () {
      test('should correctly call the store to find assessment', async function (assert) {
        // given
        model.assessment.orderedChallengeIdsAnswered = [];
        const challenge = Symbol('challenge');
        model.assessment.nextChallenge = challenge;

        // when
        const returnedModel = await route.model(params);

        // then
        sinon.assert.calledWith(route.modelFor, 'assessments');
        assert.strictEqual(returnedModel.answer, null);
        assert.strictEqual(returnedModel.assessment.nextChallenge, challenge);
      });
    });

    module('when the assessment is a Preview', function (hooks) {
      hooks.beforeEach(function () {
        const assessmentForPreview = {
          answers: [],
          type: 'PREVIEW',
          isPreview: true,
          orderedChallengeIdsAnswered: [],
        };
        route.modelFor.returns(assessmentForPreview);
      });

      test('should call findRecord to find the asked challenge', async function (assert) {
        // given
        const params = {
          challengeId: 'recId',
          challenge_number: 0,
        };
        storeStub.findRecord.resolves({ id: 'recId' });

        // when
        await route.model(params);

        // then
        sinon.assert.calledWith(findRecordStub, 'challenge', 'recId');
        assert.ok(true);
      });

      test('should not call for next challenge', async function (assert) {
        // given
        const params = {
          challengeId: null,
          challenge_number: 0,
        };

        // when
        await route.model(params);

        // then
        sinon.assert.notCalled(findRecordStub);
        assert.ok(true);
      });
    });

    module('when the asked challenge is already answered', function (hooks) {
      hooks.beforeEach(function () {
        const assessmentWithAnswers = {
          type: 'COMPETENCE_EVALUATION',
          orderedChallengeIdsAnswered: ['recId'],
        };
        route.modelFor.returns(assessmentWithAnswers);
      });

      test('should get challenge from its id', async function (assert) {
        // given
        const challenge = { id: 'recId' };
        const params = {
          challenge_number: 0,
        };
        storeStub.findRecord.resolves(challenge);

        // when
        const model = await route.model(params);

        // then
        assert.strictEqual(model.challenge, challenge);
      });
    });
  });
});
