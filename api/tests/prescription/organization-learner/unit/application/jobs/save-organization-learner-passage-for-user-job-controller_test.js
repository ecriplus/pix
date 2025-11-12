import { SaveOrganizationLearnerPassageJobController } from '../../../../../../src/prescription/organization-learner/application/jobs/save-organization-learner-passage-for-user-job-controller.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Unit | Prescription | Application | Jobs | SaveOrganizationLearnerPassageForUserJobController', function () {
  describe('#handle', function () {
    it('should log a message', async function () {
      sinon.stub(console, 'log');
      // given
      const handler = new SaveOrganizationLearnerPassageJobController();
      const userId = 123;
      const moduleId = 'abc';
      const data = { userId, moduleId };

      // when
      await handler.handle({ data });

      // then
      // eslint-disable-next-line no-console
      expect(console.log).to.have.been.calledOnce;
      // eslint-disable-next-line no-console
      expect(console.log).to.have.been.calledWithExactly(`Saving passage for user ${userId} and module ${moduleId}`);
    });
  });
});
