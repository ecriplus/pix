import * as moduleUnderTest from '../../../../../src/shared/application/lcms/index.js';
import { lcmsController } from '../../../../../src/shared/application/lcms/lcms-controller.js';
import { securityPreHandlers } from '../../../../../src/shared/application/security-pre-handlers.js';
import { expect, HttpTestServer, sinon } from '../../../../test-helper.js';

describe('Unit | Router | lcms-router', function () {
  let httpTestServer;

  beforeEach(function () {
    sinon.stub(securityPreHandlers, 'checkAdminMemberHasRoleSuperAdmin').callsFake((request, h) => h.response(true));
    sinon.stub(lcmsController, 'patchCacheEntry').callsFake((request, h) => h.response().code(204));
    sinon.stub(lcmsController, 'createRelease').callsFake((request, h) => h.response().code(204));
    sinon.stub(lcmsController, 'refreshCache').callsFake((request, h) => h.response().code(204));
    httpTestServer = new HttpTestServer();
    httpTestServer.register(moduleUnderTest);
  });

  describe('POST /api/lcms/releases', function () {
    it('should exist', async function () {
      // when
      const response = await httpTestServer.request('POST', '/api/lcms/releases');

      // then
      expect(response.statusCode).to.equal(204);
      expect(lcmsController.createRelease).to.have.been.called;
    });
  });

  describe('PATCH /api/cache/{model}/{id}', function () {
    describe('Resource access management', function () {
      it('should respond with a 400 - bad request - if model in params in not amongst allowed values', async function () {
        // given
        const response = await httpTestServer.request(
          'PATCH',
          '/api/cache/chocolats/recXYZ1234',
          {
            id: 'recChallengeId',
            param: 'updatedModelParam',
          },
          null,
          { authorization: 'some.access.token' },
        );

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    describe('nominal case', function () {
      // eslint-disable-next-line mocha/no-setup-in-describe
      [
        'frameworks',
        'areas',
        'competences',
        'thematics',
        'tubes',
        'skills',
        'challenges',
        'tutorials',
        'courses',
      ].forEach((modelName) => {
        it('should reach the controller', async function () {
          // given
          const response = await httpTestServer.request(
            'PATCH',
            `/api/cache/${modelName}/recXYZ1234`,
            {
              id: 'recChallengeId',
              param: 'updatedModelParam',
            },
            null,
            { authorization: 'some.access.token' },
          );

          // then
          expect(response.statusCode).to.equal(204);
          expect(lcmsController.patchCacheEntry).to.have.been.calledOnce;
        });
      });
    });
  });

  describe('PATCH /api/cache', function () {
    it('should exist', async function () {
      // when
      const response = await httpTestServer.request('PATCH', '/api/cache');

      // then
      expect(response.statusCode).to.equal(204);
    });
  });
});
