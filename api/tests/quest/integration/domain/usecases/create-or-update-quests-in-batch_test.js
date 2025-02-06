import { Quest } from '../../../../../src/quest/domain/models/Quest.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { repositories } from '../../../../../src/quest/infrastructure/repositories/index.js';
import { createTempFile, expect, removeTempFile, sinon } from '../../../../test-helper.js';

describe('Integration | Quest | Domain | UseCases | create-or-update-quests-in-batch', function () {
  let filePath;

  afterEach(async function () {
    await removeTempFile(filePath);
  });

  it('should save the passed quests in file', async function () {
    // given
    filePath = await createTempFile(
      'test.csv',
      `Quest ID;Json configuration for quest
    ;{"rewardType":"coucou","rewardId":null,"eligibilityRequirements":{"eligibility":"eligibility"},"successRequirements":{"success":"success"}}`,
    );
    const spy = sinon.spy(repositories.questRepository, 'saveInBatch');

    // when
    await usecases.createOrUpdateQuestsInBatch({ filePath });

    // then
    expect(spy).to.have.been.calledWithExactly({
      quests: [
        new Quest({
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined,
          rewardType: 'coucou',
          rewardId: null,
          eligibilityRequirements: { eligibility: 'eligibility' },
          successRequirements: { success: 'success' },
        }),
      ],
    });
  });
});
