import { LcmsPatchCacheJob } from '../../../../../../src/learning-content/domain/models/LcmsPatchCacheJob.js';
import { lcmsPatchCacheJobRepository } from '../../../../../../src/learning-content/infrastructure/repositories/jobs/lcms-patch-cache-job-repository.js';
import { expect } from '../../../../../test-helper.js';

describe('Learning Content | Integration | Repository | Jobs | LcmsPatchCacheJobRepository', function () {
  describe('#performAsync', function () {
    it('publish a job', async function () {
      // when
      await lcmsPatchCacheJobRepository.performAsync({
        userId: 123,
        recordId: 'recId',
        updatedRecord: {
          property: 'updatedValue',
        },
        modelName: 'challenges',
      });

      // then
      await expect(LcmsPatchCacheJob.name).to.have.been.performed.withJob({
        retrylimit: 0,
        retrydelay: 0,
        retrybackoff: false,
        data: {
          userId: 123,
          recordId: 'recId',
          updatedRecord: {
            property: 'updatedValue',
          },
          modelName: 'challenges',
        },
      });
    });
  });
});
