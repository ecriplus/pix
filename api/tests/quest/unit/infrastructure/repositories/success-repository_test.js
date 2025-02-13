import sinon from 'sinon';

import { Success } from '../../../../../src/quest/domain/models/Success.js';
import * as successRepository from '../../../../../src/quest/infrastructure/repositories/success-repository.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Infrastructure | repositories | success', function () {
  describe('#find', function () {
    it('should call Knowledge Elements API', async function () {
      // given
      const userId = Symbol('userId');
      const knowledgeElements = Symbol('knowledgeElements');
      const knowledgeElementsApi = {
        findFilteredMostRecentByUser: sinon.stub(),
      };
      knowledgeElementsApi.findFilteredMostRecentByUser.withArgs({ userId }).resolves(knowledgeElements);

      // when
      const result = await successRepository.find({
        userId,
        knowledgeElementsApi,
      });

      // then
      expect(result).to.be.an.instanceof(Success);
      expect(result.knowledgeElements).to.equal(knowledgeElements);
    });
  });
});
