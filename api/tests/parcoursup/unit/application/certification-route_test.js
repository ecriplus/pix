import { certificationController } from '../../../../src/parcoursup/application/certification-controller.js';
import * as moduleUnderTest from '../../../../src/parcoursup/application/certification-route.js';
import {
  expect,
  generateValidRequestAuthorizationHeaderForApplication,
  HttpTestServer,
  sinon,
} from '../../../test-helper.js';

describe('Parcoursup | Unit | Application | Routes | Certification', function () {
  describe('GET /parcoursup/students/{ine}/certification', function () {
    it('should return 200', async function () {
      //given
      sinon.stub(certificationController, 'getCertificationResult').callsFake((request, h) => h.response().code(200));

      const httpTestServer = new HttpTestServer();
      httpTestServer.setupAuthentication();
      await httpTestServer.register(moduleUnderTest);

      const PARCOURSUP_CLIENT_ID = 'parcoursupClientId';
      const PARCOURSUP_SCOPE = 'parcoursup';
      const PARCOURSUP_SOURCE = 'parcoursup';

      const method = 'GET';
      const url = '/api/parcoursup/students/123456789OK/certification';
      const headers = {
        authorization: generateValidRequestAuthorizationHeaderForApplication(
          PARCOURSUP_CLIENT_ID,
          PARCOURSUP_SOURCE,
          PARCOURSUP_SCOPE,
        ),
      };

      // when
      const response = await httpTestServer.request(method, url, null, null, headers);

      // then
      expect(response.statusCode).to.equal(200);
    });

    context('with the wrong scope', function () {
      it('should return 403', async function () {
        //given
        const httpTestServer = new HttpTestServer();
        httpTestServer.setupAuthentication();
        await httpTestServer.register(moduleUnderTest);

        const PARCOURSUP_CLIENT_ID = 'parcoursupClientId';
        const PARCOURSUP_SCOPE = 'a-wrong-scope';
        const PARCOURSUP_SOURCE = 'parcoursup';

        const method = 'GET';
        const url = '/api/parcoursup/students/123456789OK/certification';
        const headers = {
          authorization: generateValidRequestAuthorizationHeaderForApplication(
            PARCOURSUP_CLIENT_ID,
            PARCOURSUP_SOURCE,
            PARCOURSUP_SCOPE,
          ),
        };

        // when
        const response = await httpTestServer.request(method, url, null, null, headers);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    context('with the wrong clientId', function () {
      it('should return 401', async function () {
        //given
        const httpTestServer = new HttpTestServer();
        httpTestServer.setupAuthentication();
        await httpTestServer.register(moduleUnderTest);

        const PARCOURSUP_CLIENT_ID = 'wrongClientId';
        const PARCOURSUP_SCOPE = 'parcoursup';
        const PARCOURSUP_SOURCE = 'parcoursup';

        const method = 'GET';
        const url = '/api/parcoursup/students/123456789OK/certification';
        const headers = {
          authorization: generateValidRequestAuthorizationHeaderForApplication(
            PARCOURSUP_CLIENT_ID,
            PARCOURSUP_SOURCE,
            PARCOURSUP_SCOPE,
          ),
        };

        // when
        const response = await httpTestServer.request(method, url, null, null, headers);

        // then
        expect(response.statusCode).to.equal(401);
      });
    });
  });
});
