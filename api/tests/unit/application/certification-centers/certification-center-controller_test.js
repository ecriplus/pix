import { certificationCenterMembershipController } from '../../../../src/team/application/certification-center-membership/certification-center-membership.controller.js';
import { usecases } from '../../../../src/team/domain/usecases/index.js';
import { expect, hFake, sinon } from '../../../test-helper.js';

describe('Unit | Controller | certifications-center-controller', function () {
  describe('#updateReferer', function () {
    it('should call updateCertificationCenterReferer usecase and return 204', async function () {
      // given
      const request = {
        params: { certificationCenterId: 456 },
        payload: {
          data: {
            attributes: {
              isReferer: true,
              userId: 1234,
            },
          },
        },
      };

      sinon.stub(usecases, 'updateCertificationCenterReferer').resolves();

      // when
      const response = await certificationCenterMembershipController.updateReferer(request, hFake);

      // then
      expect(usecases.updateCertificationCenterReferer).calledWith({
        userId: 1234,
        certificationCenterId: 456,
        isReferer: true,
      });
      expect(response.statusCode).to.equal(204);
    });
  });
});
