import { certificationCenterController } from '../../../../lib/application/certification-centers/certification-center-controller.js';
import { usecases } from '../../../../lib/domain/usecases/index.js';
import { usecases as teamUsecases } from '../../../../src/team/domain/usecases/index.js';
import { expect, hFake, sinon } from '../../../test-helper.js';

describe('Unit | Controller | certifications-center-controller', function () {
  describe('#findCertificationCenterMembershipsByCertificationCenter', function () {
    const certificationCenterId = 1;

    const request = {
      params: {
        certificationCenterId,
      },
    };
    let certificationCenterMembershipSerializerStub;

    beforeEach(function () {
      sinon.stub(teamUsecases, 'findCertificationCenterMembershipsByCertificationCenter');
      certificationCenterMembershipSerializerStub = {
        serialize: sinon.stub(),
      };
    });

    it('should call usecase and serializer and return ok', async function () {
      // given
      teamUsecases.findCertificationCenterMembershipsByCertificationCenter
        .withArgs({
          certificationCenterId,
        })
        .resolves({});
      certificationCenterMembershipSerializerStub.serialize.withArgs({}).returns('ok');

      // when
      const response = await certificationCenterController.findCertificationCenterMembershipsByCertificationCenter(
        request,
        hFake,
        { certificationCenterMembershipSerializer: certificationCenterMembershipSerializerStub },
      );

      // then
      expect(response).to.equal('ok');
    });
  });

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
      const response = await certificationCenterController.updateReferer(request, hFake);

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
