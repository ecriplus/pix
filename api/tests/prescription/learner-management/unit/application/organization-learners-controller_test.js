import { CLIENT, PIX_ADMIN } from '../../../../../src/authorization/domain/constants.js';
import { organizationLearnersController } from '../../../../../src/prescription/learner-management/application/organization-learners-controller.js';
import { usecases } from '../../../../../src/prescription/learner-management/domain/usecases/index.js';
import { expect, hFake, sinon } from '../../../../test-helper.js';

describe('Unit | Prescription | Learner Management | Application | organization-learner-controller', function () {
  describe('#importOrganizationLearnerFromFeature', function () {
    let sendOrganizationLearnersFileStub;

    beforeEach(function () {
      sendOrganizationLearnersFileStub = sinon.stub(usecases, 'sendOrganizationLearnersFile');
    });

    it('should call usecases in correct order', async function () {
      const userId = Symbol('userId');
      const organizationId = Symbol('organizationId');
      const payload = Symbol('payload');
      const request = {
        auth: { credentials: { userId } },
        params: { organizationId },
        payload,
      };

      const response = await organizationLearnersController.importOrganizationLearnerFromFeature(request, hFake);

      expect(
        sendOrganizationLearnersFileStub.calledWithExactly({ payload, organizationId, userId }),
        'sendOrganizationLearnerFile',
      ).to.be.true;

      expect(response.statusCode).to.be.equal(204);
    });
  });

  describe('#reconcileCommonOrganizationLearner', function () {
    let reconcileCommonOrganizationLearnerStub;

    beforeEach(function () {
      reconcileCommonOrganizationLearnerStub = sinon.stub(usecases, 'reconcileCommonOrganizationLearner');
    });

    it('called usecases with correct parameters', async function () {
      const userId = Symbol('userId');
      const code = Symbol('campaignCode');
      const reconciliationInfos = Symbol('reconciliationInfos');
      const request = {
        auth: { credentials: { userId } },
        deserializedPayload: {
          code,
          reconciliationInfos,
        },
      };

      const response = await organizationLearnersController.reconcileCommonOrganizationLearner(request, hFake);

      expect(
        reconcileCommonOrganizationLearnerStub.calledWithExactly({ userId, code, reconciliationInfos }),
        'reconcileCommonOrganizationLearner',
      ).to.be.true;
      expect(response.statusCode).to.be.equal(204);
    });
  });

  describe('#deleteOrganizationLearnerFromAdmin', function () {
    let deleteOrganizationLearnersStub;

    beforeEach(function () {
      deleteOrganizationLearnersStub = sinon.stub(usecases, 'deleteOrganizationLearners');
    });

    it('called usecases with correct parameters', async function () {
      const userId = Symbol('userId');
      const organizationLearnerId = Symbol('organizationLearnerId');
      const organizationId = Symbol('organizationId');

      const request = {
        auth: { credentials: { userId } },
        params: {
          organizationLearnerId,
          organizationId,
        },
      };

      const response = await organizationLearnersController.deleteOrganizationLearnerFromAdmin(request, hFake);

      expect(
        deleteOrganizationLearnersStub.calledWithExactly({
          userId,
          organizationLearnerIds: [organizationLearnerId],
          organizationId,
          userRole: PIX_ADMIN.ROLES.SUPPORT,
          client: CLIENT.PIX_ADMIN,
        }),
        'deleteOrganizationLearners',
      ).to.be.true;
      expect(response.statusCode).to.be.equal(200);
    });
  });
});
