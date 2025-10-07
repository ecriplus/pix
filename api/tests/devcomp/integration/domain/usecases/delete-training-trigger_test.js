import { usecases } from '../../../../../src/devcomp/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Devcomp | Domain | UseCases | deleteTrainingTrigger', function () {
  context('when deleting a training trigger', function () {
    it('should successfully delete the training trigger and its associated tubes', async function () {
      // given
      const { id: trainingId } = databaseBuilder.factory.buildTraining();
      const trainingTrigger = databaseBuilder.factory.buildTrainingTrigger({
        trainingId,
        type: 'prerequisite',
        threshold: 50,
      });

      databaseBuilder.factory.buildTrainingTriggerTube({
        trainingTriggerId: trainingTrigger.id,
        tubeId: 'rec0',
        level: 1,
      });
      databaseBuilder.factory.buildTrainingTriggerTube({
        trainingTriggerId: trainingTrigger.id,
        tubeId: 'rec1',
        level: 2,
      });

      await databaseBuilder.commit();

      // when
      const result = await usecases.deleteTrainingTrigger({
        trainingTriggerId: trainingTrigger.id,
      });

      // then
      const remainingTriggers = await databaseBuilder.knex('training-triggers').where({ id: trainingTrigger.id });
      const remainingTubes = await databaseBuilder
        .knex('training-trigger-tubes')
        .where({ trainingTriggerId: trainingTrigger.id });

      expect(remainingTriggers).to.have.lengthOf(0);
      expect(remainingTubes).to.have.lengthOf(0);
      expect(result).to.be.undefined;
    });
  });

  context('when trying to delete a non-existent training trigger', function () {
    it('should not throw an error and return undefined', async function () {
      // given
      const nonExistentTriggerId = 12;

      // when
      const result = await usecases.deleteTrainingTrigger({
        trainingTriggerId: nonExistentTriggerId,
      });

      // then
      expect(result).to.be.undefined;
    });
  });
});
