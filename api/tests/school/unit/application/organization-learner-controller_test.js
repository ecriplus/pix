import { organizationLearnerController } from '../../../../src/school/application/organization-learner-controller.js';
import { OrganizationLearnerDTO } from '../../../../src/school/domain/read-models/OrganizationLearnerDTO.js';
import { usecases } from '../../../../src/school/domain/usecases/index.js';
import { expect, hFake, sinon } from '../../../test-helper.js';

describe('Unit | Controller | organization-learner-controller', function () {
  describe('#getById', function () {
    it('should return the serialized organization-learner with completed mission ids', async function () {
      sinon.stub(usecases, 'getOrganizationLearnerWithCompletedMissionIds');
      usecases.getOrganizationLearnerWithCompletedMissionIds.resolves(
        new OrganizationLearnerDTO({
          id: '4356',
          completedMissionIds: ['rec12344', 'rec435'],
          firstName: 'Edward',
          division: 'CM2',
          organizationId: '345',
        }),
      );
      const id = 4356;
      const request = {
        params: { id },
      };

      const response = await organizationLearnerController.getById(request, hFake);

      const expectedOrganizationLearner = {
        data: {
          attributes: {
            'completed-mission-ids': ['rec12344', 'rec435'],
            'first-name': 'Edward',
            'display-name': undefined,
            division: 'CM2',
            'organization-id': '345',
          },
          id: '4356',
          type: 'organizationLearners',
        },
      };

      expect(usecases.getOrganizationLearnerWithCompletedMissionIds).to.have.been.calledWith({
        organizationLearnerId: id,
      });
      expect(response).to.deep.equal(expectedOrganizationLearner);
    });
  });
});
