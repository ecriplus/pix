import { certificationCenterMembershipAdminController } from '../../../../../src/team/application/certification-center-membership/certification-center-membership.admin.controller.js';
import { usecases } from '../../../../../src/team/domain/usecases/index.js';
import { domainBuilder, expect, hFake, sinon } from '../../../../test-helper.js';

describe('Unit | Team | Application | Controller | CertificationCenterMembershipAdminController', function () {
  describe('#createCertificationCenterMembershipByEmail', function () {
    const certificationCenterId = 1;
    const email = 'user@example.net';

    const request = {
      params: { certificationCenterId },
      payload: { email },
    };

    let certificationCenterMembershipSerializerStub;

    beforeEach(function () {
      sinon.stub(usecases, 'createCertificationCenterMembershipByEmail');
      certificationCenterMembershipSerializerStub = {
        serialize: sinon.stub().returns('ok'),
      };
      usecases.createCertificationCenterMembershipByEmail.resolves();
    });

    it('should call usecase and serializer and return 201 HTTP code', async function () {
      // when
      const response = await certificationCenterMembershipAdminController.createCertificationCenterMembershipByEmail(
        request,
        hFake,
        {
          certificationCenterMembershipSerializer: certificationCenterMembershipSerializerStub,
        },
      );

      // then
      expect(usecases.createCertificationCenterMembershipByEmail).calledWith({ certificationCenterId, email });
      expect(response.source).to.equal('ok');
      expect(response.statusCode).to.equal(201);
    });
  });

  describe('#updateRole', function () {
    const id = 1;
    let certificationCenterMembership;

    const request = {
      params: { id },
      payload: {},
    };

    let certificationCenterMembershipSerializerStub;
    let requestResponseUtilsStub;

    beforeEach(function () {
      sinon.stub(usecases, 'updateCertificationCenterMembership');
      certificationCenterMembership = domainBuilder.buildCertificationCenterMembership();
      certificationCenterMembershipSerializerStub = {
        deserialize: sinon.stub().returns(certificationCenterMembership),
        serializeForAdmin: sinon.stub(),
      };
      requestResponseUtilsStub = {
        extractUserIdFromRequest: sinon.stub().returns(1234),
      };
      usecases.updateCertificationCenterMembership.resolves();
    });

    it('should call usecase and serializer and return 201 HTTP code', async function () {
      // when
      const response = await certificationCenterMembershipAdminController.updateRole(request, hFake, {
        certificationCenterMembershipSerializer: certificationCenterMembershipSerializerStub,
        requestResponseUtils: requestResponseUtilsStub,
      });

      // then
      expect(usecases.updateCertificationCenterMembership).calledWith({
        certificationCenterMembershipId: 1,
        role: certificationCenterMembership.role,
        updatedByUserId: 1234,
      });

      expect(response.statusCode).to.equal(200);
    });
  });

  describe('#disableFromPixAdmin', function () {
    const id = 1;

    const request = {
      params: { id },
      payload: {},
    };

    let requestResponseUtilsStub;

    beforeEach(function () {
      sinon.stub(usecases, 'disableCertificationCenterMembershipFromPixAdmin');

      requestResponseUtilsStub = {
        extractUserIdFromRequest: sinon.stub().returns(1234),
      };
      usecases.disableCertificationCenterMembershipFromPixAdmin.resolves();
    });

    it('should call usecase and serializer and return 201 HTTP code', async function () {
      // when
      const response = await certificationCenterMembershipAdminController.disableFromPixAdmin(request, hFake, {
        requestResponseUtils: requestResponseUtilsStub,
      });

      // then
      expect(usecases.disableCertificationCenterMembershipFromPixAdmin).calledWith({
        certificationCenterMembershipId: 1,
        updatedByUserId: 1234,
      });

      expect(response.statusCode).to.equal(204);
    });
  });

  describe('#findCertificationCenterMembershipsByUser', function () {
    describe('#findCertificationCenterMembershipsByUser', function () {
      it("returns user's certification centers", async function () {
        // given
        const certificationCenterMemberships = Symbol("a list of user's certification center memberships");
        const certificationCenterMembershipsSerialized = Symbol(
          "a list of user's certification center memberships serialized",
        );

        const certificationCenterMembershipSerializer = { serializeForAdmin: sinon.stub() };
        certificationCenterMembershipSerializer.serializeForAdmin
          .withArgs(certificationCenterMemberships)
          .returns(certificationCenterMembershipsSerialized);

        sinon
          .stub(usecases, 'findCertificationCenterMembershipsByUser')
          .withArgs({ userId: 12345 })
          .resolves(certificationCenterMemberships);

        // when
        const request = {
          params: {
            id: 12345,
          },
        };
        const result = await certificationCenterMembershipAdminController.findCertificationCenterMembershipsByUser(
          request,
          hFake,
          {
            certificationCenterMembershipSerializer,
          },
        );

        // then
        expect(result.source).to.equal(certificationCenterMembershipsSerialized);
      });
    });
  });
});
