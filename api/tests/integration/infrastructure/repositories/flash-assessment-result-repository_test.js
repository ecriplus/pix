import * as flashAssessmentResultRepository from '../../../../lib/infrastructure/repositories/flash-assessment-result-repository.js';
import { databaseBuilder, expect, knex } from '../../../test-helper.js';

describe('Integration | Infrastructure | Repository | FlashAssessmentResultRepository', function () {
  describe('#save', function () {
    it('should create a result with estimated level and error rate', async function () {
      // given
      const answerId = databaseBuilder.factory.buildAnswer().id;
      databaseBuilder.factory.buildAssessment({ id: 99 });
      await databaseBuilder.commit();

      // when
      await flashAssessmentResultRepository.save({
        answerId,
        estimatedLevel: 1.9,
        errorRate: 1.3,
        assessmentId: 99,
      });

      // then
      const createdResult = await knex('flash-assessment-results').select().where({ answerId }).first();
      expect(createdResult).to.contain({
        answerId,
        estimatedLevel: 1.9,
        errorRate: 1.3,
        assessmentId: 99,
      });
    });
  });
});
