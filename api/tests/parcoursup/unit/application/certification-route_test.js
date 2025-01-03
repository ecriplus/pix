import { certificationController } from '../../../../src/parcoursup/application/certification-controller.js';
import * as moduleUnderTest from '../../../../src/parcoursup/application/certification-route.js';
import {
  expect,
  generateValidRequestAuthorizationHeaderForApplication,
  HttpTestServer,
  sinon,
} from '../../../test-helper.js';

describe('Parcoursup | Unit | Application | Routes | Certification', function () {
  describe('GET /parcoursup/certification/search?ine={ine}', function () {
    it('should return 200', async function () {
      //given
      sinon.stub(certificationController, 'getCertificationResult').callsFake((request, h) => h.response().code(200));

      const httpTestServer = new HttpTestServer();
      httpTestServer.setupAuthentication();
      await httpTestServer.register(moduleUnderTest);

      const PARCOURSUP_CLIENT_ID = 'test-parcoursupClientId';
      const PARCOURSUP_SCOPE = 'parcoursup';
      const PARCOURSUP_SOURCE = 'parcoursup';

      const method = 'GET';
      const url = '/api/parcoursup/certification/search?ine=123456789OK';
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

    context('when the param is missing', function () {
      let httpTestServer, headers;
      beforeEach(async function () {
        httpTestServer = new HttpTestServer();
        httpTestServer.setupAuthentication();
        await httpTestServer.register(moduleUnderTest);

        const PARCOURSUP_CLIENT_ID = 'test-parcoursupClientId';
        const PARCOURSUP_SCOPE = 'parcoursup';
        const PARCOURSUP_SOURCE = 'parcoursup';

        headers = {
          authorization: generateValidRequestAuthorizationHeaderForApplication(
            PARCOURSUP_CLIENT_ID,
            PARCOURSUP_SOURCE,
            PARCOURSUP_SCOPE,
          ),
        };
      });

      it('return 400 error', async function () {
        const url = '/api/parcoursup/certification/search?ine=';

        // when
        const response = await httpTestServer.request('GET', url, null, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    context('with the wrong scope', function () {
      it('should return 403', async function () {
        //given
        const httpTestServer = new HttpTestServer();
        httpTestServer.setupAuthentication();
        await httpTestServer.register(moduleUnderTest);

        const PARCOURSUP_CLIENT_ID = 'test-parcoursupClientId';
        const PARCOURSUP_SCOPE = 'a-wrong-scope';
        const PARCOURSUP_SOURCE = 'parcoursup';

        const method = 'GET';
        const url = '/api/parcoursup/certification/search?ine=123456789OK';
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
        const url = '/api/parcoursup/certification/search?ine=123456789OK';
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

  describe('GET /parcoursup/certification/search?organizationUai={organizationUai}&lastName={lastName}&firstName={firstName}&birthdate={birthdate}', function () {
    it('should return 200', async function () {
      //given
      sinon.stub(certificationController, 'getCertificationResult').callsFake((request, h) => h.response().code(200));

      const httpTestServer = new HttpTestServer();
      httpTestServer.setupAuthentication();
      await httpTestServer.register(moduleUnderTest);

      const PARCOURSUP_CLIENT_ID = 'test-parcoursupClientId';
      const PARCOURSUP_SCOPE = 'parcoursup';
      const PARCOURSUP_SOURCE = 'parcoursup';

      const method = 'GET';
      const url =
        '/api/parcoursup/certification/search?organizationUai=1234567A&lastName=LEPONGE&firstName=BOB&birthdate=2000-01-01';
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

    context('return 400 error when any required query param is missing', function () {
      let httpTestServer, headers;
      beforeEach(async function () {
        httpTestServer = new HttpTestServer();
        httpTestServer.setupAuthentication();
        await httpTestServer.register(moduleUnderTest);

        const PARCOURSUP_CLIENT_ID = 'test-parcoursupClientId';
        const PARCOURSUP_SCOPE = 'parcoursup';
        const PARCOURSUP_SOURCE = 'parcoursup';

        headers = {
          authorization: generateValidRequestAuthorizationHeaderForApplication(
            PARCOURSUP_CLIENT_ID,
            PARCOURSUP_SOURCE,
            PARCOURSUP_SCOPE,
          ),
        };
      });

      it('case of organizationUai', async function () {
        const url = '/api/parcoursup/certification/search?lastName=LEPONGE&firstName=BOB&birthdate=2000-01-01';

        // when
        const response = await httpTestServer.request('GET', url, null, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('case of lastName', async function () {
        const url = '/api/parcoursup/certification/search?organizationUai=1234567A&firstName=BOB&birthdate=2000-01-01';

        // when
        const response = await httpTestServer.request('GET', url, null, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('case of firstName', async function () {
        const url =
          '/api/parcoursup/certification/search?organizationUai=1234567A&lastName=LEPONGE&birthdate=2000-01-01';

        // when
        const response = await httpTestServer.request('GET', url, null, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('case of birthdate', async function () {
        const url = '/api/parcoursup/certification/search?organizationUai=1234567A&lastName=LEPONGE&firstName=BOB';

        // when
        const response = await httpTestServer.request('GET', url, null, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  describe('GET /parcoursup/certification/search?verificationCode={verificationCode}&lastName={lastName}&firstName={firstName}', function () {
    it('should return 200', async function () {
      //given
      sinon.stub(certificationController, 'getCertificationResult').callsFake((request, h) => h.response().code(200));

      const httpTestServer = new HttpTestServer();
      httpTestServer.setupAuthentication();
      await httpTestServer.register(moduleUnderTest);

      const PARCOURSUP_CLIENT_ID = 'test-parcoursupClientId';
      const PARCOURSUP_SCOPE = 'parcoursup';
      const PARCOURSUP_SOURCE = 'parcoursup';

      const method = 'GET';
      const url = '/api/parcoursup/certification/search?verificationCode=P-1234567A&lastName=LEPONGE&firstName=BOB';
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

    context('when verificationCode format is invalid', function () {
      it('returns 400 error', async function () {
        const httpTestServer = new HttpTestServer();
        httpTestServer.setupAuthentication();
        await httpTestServer.register(moduleUnderTest);

        const PARCOURSUP_CLIENT_ID = 'test-parcoursupClientId';
        const PARCOURSUP_SCOPE = 'parcoursup';
        const PARCOURSUP_SOURCE = 'parcoursup';

        const url = '/api/parcoursup/certification/search?verificationCode=1234567A&lastName=LEPONGE&firstName=BOB';
        const headers = {
          authorization: generateValidRequestAuthorizationHeaderForApplication(
            PARCOURSUP_CLIENT_ID,
            PARCOURSUP_SOURCE,
            PARCOURSUP_SCOPE,
          ),
        };

        // when
        const response = await httpTestServer.request('GET', url, null, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });

  describe('GET /parcoursup/certification/search?ine={ine}&organizationUai={organizationUai}', function () {
    context('when both ine and organizationUai are used', function () {
      let httpTestServer, headers;
      beforeEach(async function () {
        httpTestServer = new HttpTestServer();
        httpTestServer.setupAuthentication();
        await httpTestServer.register(moduleUnderTest);

        const PARCOURSUP_CLIENT_ID = 'test-parcoursupClientId';
        const PARCOURSUP_SCOPE = 'parcoursup';
        const PARCOURSUP_SOURCE = 'parcoursup';

        headers = {
          authorization: generateValidRequestAuthorizationHeaderForApplication(
            PARCOURSUP_CLIENT_ID,
            PARCOURSUP_SOURCE,
            PARCOURSUP_SCOPE,
          ),
        };
      });

      it('returns 400 error ', async function () {
        const url = '/api/parcoursup/certification/search?ine=123456789OK&organizationUai=123orgaUai';

        // when
        const response = await httpTestServer.request('GET', url, null, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });
  });
});
