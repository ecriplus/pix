import * as moduleUnderTest from '../../../../lib/application/memberships/index.js';
import { securityPreHandlers } from '../../../../src/shared/application/security-pre-handlers.js';
import { membershipController } from '../../../../src/team/application/membership/membership.controller.js';
import { expect, HttpTestServer, sinon } from '../../../test-helper.js';

describe('Unit | Router | membership-router', function () {
  describe('POST /api/memberships/{id}/disable', function () {
    it('should return 204 if user is admin in organization', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkUserIsAdminInOrganization').callsFake((request, h) => h.response(true));
      sinon.stub(membershipController, 'disable').callsFake((request, h) => h.response().code(204));

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const membershipId = 123;

      // when
      const response = await httpTestServer.request('POST', `/api/memberships/${membershipId}/disable`);

      // then
      expect(response.statusCode).to.equal(204);
      expect(membershipController.disable).to.have.been.called;
    });

    it('should return 403 if user is not admin in organization', async function () {
      // given
      sinon
        .stub(securityPreHandlers, 'checkUserIsAdminInOrganization')
        .callsFake((request, h) => h.response().code(403).takeover());
      sinon.stub(membershipController, 'disable');

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(moduleUnderTest);
      const membershipId = 123;

      // when
      const response = await httpTestServer.request('POST', `/api/memberships/${membershipId}/disable`);

      // then
      expect(response.statusCode).to.equal(403);
      expect(membershipController.disable).to.have.not.been.called;
    });
  });
});
