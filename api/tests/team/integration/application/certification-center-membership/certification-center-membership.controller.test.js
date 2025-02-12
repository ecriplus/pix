import { securityPreHandlers } from '../../../../../src/shared/application/security-pre-handlers.js';
import { certificationCenterMembershipController } from '../../../../../src/team/application/certification-center-membership/certification-center-membership.controller.js';
import { teamRoutes } from '../../../../../src/team/application/routes.js';
import { expect, HttpTestServer, sinon } from '../../../../test-helper.js';

describe('Integration | Application | certification-center-memberships | certification-center-membership-controller', function () {
  let httpTestServer;

  beforeEach(async function () {
    sinon
      .stub(certificationCenterMembershipController, 'updateFromPixCertif')
      .callsFake((request, h) => h.response('ok').code(200));
    sinon.stub(securityPreHandlers, 'checkUserIsAdminOfCertificationCenter').returns(() => true);
    httpTestServer = new HttpTestServer();
    await httpTestServer.register(teamRoutes);
  });

  describe('PATCH  /api/certification-centers/{certificationCenterId}/certification-center-memberships/{id}', function () {
    context('Success cases', function () {
      it('calls updateFromPixCertif method', async function () {
        // when
        await httpTestServer.request('PATCH', '/api/certification-centers/123/certification-center-memberships/456');

        // then
        expect(certificationCenterMembershipController.updateFromPixCertif).to.be.called;
      });
    });
  });
});
