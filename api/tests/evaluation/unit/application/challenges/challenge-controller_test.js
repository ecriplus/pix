import sinon from 'sinon';

import { challengeController } from '../../../../../src/evaluation/application/challenges/challenge-controller.js';
import { expect } from '../../../../test-helper.js';
import { hFake } from '../../../../tooling/mocks/hapi.mock.js';

describe('Evaluation | Unit | Application | challenge-controller', function () {
  let challengeToPlayApi;

  beforeEach(async function () {
    challengeToPlayApi = { get: sinon.stub(), serialize: sinon.stub() };
  });

  describe('#get', function () {
    it('should fetch and return the given challenge, serialized as JSONAPI', async function () {
      // given
      const challengeId = 123;
      const challenge = Symbol('someChallenge');
      const expectedResult = Symbol('serialized-challenge');
      challengeToPlayApi.get.resolves(challenge);
      challengeToPlayApi.serialize.resolves(expectedResult);

      // when
      const response = await challengeController.get({ params: { id: challengeId } }, hFake, {
        challengeToPlayApi,
      });

      // then
      expect(challengeToPlayApi.get).to.have.been.calledWithExactly(challengeId);
      expect(challengeToPlayApi.serialize).to.have.been.calledOnce;
      expect(response).to.deep.equal(expectedResult);
    });
  });
});
