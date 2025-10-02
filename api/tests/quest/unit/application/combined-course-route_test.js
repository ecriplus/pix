import { combinedCourseController } from '../../../../src/quest/application/combined-course-controller.js';
import * as combinedCourseRoute from '../../../../src/quest/application/combined-course-route.js';
import { securityPreHandlers } from '../../../../src/shared/application/security-pre-handlers.js';
import { expect, HttpTestServer, sinon } from '../../../test-helper.js';

describe('Quest | Unit | Routes | combined-course-route', function () {
  describe('GET /api/combined-course', function () {
    it('should call prehandler', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkAuthorizationToAccessCombinedCourse').returns(() => true);
      sinon.stub(combinedCourseController, 'getByCode').callsFake((request, h) => h.response());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(combinedCourseRoute);

      // when
      await httpTestServer.request('GET', '/api/combined-courses?filter[code]=ABC');

      // then
      expect(securityPreHandlers.checkAuthorizationToAccessCombinedCourse).to.have.been.called;
    });
  });

  describe('GET /api/combined-courses/{questId}', function () {
    it('should call prehandler', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkUserCanManageCombinedCourse').returns(() => true);
      sinon.stub(combinedCourseController, 'getById').callsFake((request, h) => h.response());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(combinedCourseRoute);

      // when
      await httpTestServer.request('GET', '/api/combined-courses/123');

      // then
      expect(securityPreHandlers.checkUserCanManageCombinedCourse).to.have.been.called;
    });
  });

  describe('GET /api/combined-courses/{questId}/statistics', function () {
    it('should call prehandler', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkUserCanManageCombinedCourse').returns(() => true);
      sinon.stub(combinedCourseController, 'getStatistics').callsFake((request, h) => h.response());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(combinedCourseRoute);

      // when
      await httpTestServer.request('GET', '/api/combined-courses/123/statistics');

      // then
      expect(securityPreHandlers.checkUserCanManageCombinedCourse).to.have.been.called;
    });
  });

  describe('GET /api/combined-courses/{questId}/participations', function () {
    it('should call prehandler', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkUserCanManageCombinedCourse').returns(() => true);
      sinon.stub(combinedCourseController, 'findParticipations').callsFake((request, h) => h.response());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(combinedCourseRoute);

      // when
      await httpTestServer.request('GET', '/api/combined-courses/123/participations');

      // then
      expect(securityPreHandlers.checkUserCanManageCombinedCourse).to.have.been.called;
    });
  });

  describe('PUT /api/combined-course/{code}/start', function () {
    it('should call prehandler', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkAuthorizationToAccessCombinedCourse').returns(() => true);
      sinon.stub(combinedCourseController, 'start').callsFake((request, h) => h.response());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(combinedCourseRoute);

      // when
      await httpTestServer.request('PUT', '/api/combined-courses/ABC/start');

      // then
      expect(securityPreHandlers.checkAuthorizationToAccessCombinedCourse).to.have.been.called;
    });
  });

  describe('PATCH /api/combined-course/{code}/reassess-status', function () {
    it('should call prehandler', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkAuthorizationToAccessCombinedCourse').returns(() => true);
      sinon.stub(combinedCourseController, 'reassessStatus').callsFake((request, h) => h.response());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(combinedCourseRoute);

      // when
      await httpTestServer.request('PATCH', '/api/combined-courses/ABC/reassess-status');

      // then
      expect(securityPreHandlers.checkAuthorizationToAccessCombinedCourse).to.have.been.called;
    });
  });

  describe('GET /api/organizations/{organizationId}/combined-courses', function () {
    it('should call prehandler', async function () {
      // given
      sinon.stub(securityPreHandlers, 'checkUserBelongsToOrganization').returns(() => true);
      sinon.stub(combinedCourseController, 'getByOrganizationId').callsFake((request, h) => h.response());

      const httpTestServer = new HttpTestServer();
      await httpTestServer.register(combinedCourseRoute);

      // when
      await httpTestServer.request('GET', '/api/organizations/123/combined-courses');

      // then
      expect(securityPreHandlers.checkUserBelongsToOrganization).to.have.been.called;
    });
  });
});
