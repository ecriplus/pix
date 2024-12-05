import { LcmsPatchCacheJob } from '../../../../src/learning-content/domain/models/LcmsPatchCacheJob.js';
import { usecases } from '../../../../src/learning-content/domain/usecases/index.js';
import { expect } from '../../../test-helper.js';

describe('Learning Content | Integration | Domain | Use case | schedulePatchLearningContentCacheEntryJob', function () {
  it('should schedule the job', async function () {
    await usecases.schedulePatchLearningContentCacheEntryJob({
      userId: 123,
      recordId: 'recId',
      updatedRecord: {
        property: 'updatedValue',
      },
      modelName: 'challenges',
    });

    await expect(LcmsPatchCacheJob.name).to.have.been.performed.withJobPayload({
      userId: 123,
      recordId: 'recId',
      updatedRecord: {
        property: 'updatedValue',
      },
      modelName: 'challenges',
    });
  });
});
