import { SaveOrganizationLearnerPassageForUserJob } from '../../../../../../../src/prescription/organization-learner/domain/models/SaveOrganizationLearnerPassageForUserJob.js';
import { saveOrganizationLearnerPassageForUserJobRepository } from '../../../../../../../src/prescription/organization-learner/infrastructure/repositories/jobs/save-organization-learner-passage-for-user-job-repository.js';
import { expect } from '../../../../../../test-helper.js';

describe('Integration | Prescription | Application | Jobs | saveOrganizationLearnerPassageForUserJobRepository', function () {
  describe('#performAsync', function () {
    it('publish a job', async function () {
      // given
      const userId = 4123132;
      const moduleId = 'module-1';

      // when
      await saveOrganizationLearnerPassageForUserJobRepository.performAsync({ userId, moduleId });

      // then
      await expect(SaveOrganizationLearnerPassageForUserJob.name).to.have.been.performed.withJob({
        retrylimit: 0,
        retrydelay: 0,
        retrybackoff: false,
        data: { userId, moduleId },
      });
    });
  });
});
