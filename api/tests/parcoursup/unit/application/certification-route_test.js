import { certificationController } from '../../../../src/parcoursup/application/certification-controller.js';
import * as moduleUnderTest from '../../../../src/parcoursup/application/certification-route.js';
import {
  expect,
  generateValidRequestAuthorizationHeaderForApplication,
  HttpTestServer,
  sinon,
} from '../../../test-helper.js';

describe('Parcoursup | Unit | Application | Routes | Certification', function () {
  let url, method, headers, httpTestServer;

  beforeEach(async function () {
    url = '/api/application/parcoursup/certification/search';
    sinon.stub(certificationController, 'getCertificationResult').callsFake((request, h) => h.response().code(200));

    httpTestServer = new HttpTestServer();
    httpTestServer.setupAuthentication();
    await httpTestServer.register(moduleUnderTest);

    const PARCOURSUP_CLIENT_ID = 'test-parcoursupClientId';
    const PARCOURSUP_SCOPE = 'parcoursup';
    const PARCOURSUP_SOURCE = 'parcoursup';

    method = 'POST';
    headers = {
      authorization: generateValidRequestAuthorizationHeaderForApplication(
        PARCOURSUP_CLIENT_ID,
        PARCOURSUP_SOURCE,
        PARCOURSUP_SCOPE,
      ),
    };
  });

  describe('POST /parcoursup/certification/search', function () {
    it('should return 200 with a valid ine params in body', async function () {
      //given
      const payload = {
        ine: '123456789OK',
      };
      // when
      const response = await httpTestServer.request(method, url, payload, null, headers);

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 200 with with valid organizationUai, lastName, firstName and birthdate in body params', async function () {
      //given
      const payload = {
        organizationUai: '1234567A',
        lastName: 'LEPONGE',
        firstName: 'BOB',
        birthdate: '2000-01-01',
      };

      // when
      const response = await httpTestServer.request(method, url, payload, null, headers);

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return 200 with a valide verificationCode params in body', async function () {
      //given
      const payload = {
        verificationCode: 'P-1234567A',
      };

      // when
      const response = await httpTestServer.request(method, url, payload, null, headers);

      // then
      expect(response.statusCode).to.equal(200);
    });

    context('return 400 error', function () {
      it('case of empty payload', async function () {
        const payload = {};

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('case of null payload', async function () {
        const payload = null;

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('case of missing INE', async function () {
        const payload = { ine: '' };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('case of missing organizationUai', async function () {
        const payload = {
          lastName: 'LEPONGE',
          firstName: 'BOB',
          birthdate: '2000-01-01',
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('case of missing lastName', async function () {
        const payload = {
          organizationUai: '1234567A',
          firstName: 'BOB',
          birthdate: '2000-01-01',
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('case of firstName', async function () {
        const payload = {
          organizationUai: '1234567A',
          lastName: 'LEPONGE',
          birthdate: '2000-01-01',
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('case of birthdate', async function () {
        const payload = {
          organizationUai: '1234567A',
          lastName: 'LEPONGE',
          firstName: 'BOB',
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });

      it('case of verificationCode format is invalid', async function () {
        const payload = {
          verificationCode: '1234567A',
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });
      it('case of ine AND organizationUai', async function () {
        const payload = {
          ine: '123456789OK',
          organizationUai: '123orgaUai',
        };

        // when
        const response = await httpTestServer.request(method, url, payload, null, headers);

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    it('should return 403 with a wrong scope', async function () {
      //given
      const PARCOURSUP_CLIENT_ID = 'test-parcoursupClientId';
      const PARCOURSUP_SCOPE = 'a-wrong-scope';
      const PARCOURSUP_SOURCE = 'parcoursup';

      const payload = { ine: '123456789OK' };
      headers = {
        authorization: generateValidRequestAuthorizationHeaderForApplication(
          PARCOURSUP_CLIENT_ID,
          PARCOURSUP_SOURCE,
          PARCOURSUP_SCOPE,
        ),
      };

      // when
      const response = await httpTestServer.request(method, url, payload, null, headers);

      // then
      expect(response.statusCode).to.equal(403);
    });

    it('should return 401 with the wrong clientId', async function () {
      //given
      const PARCOURSUP_CLIENT_ID = 'wrongClientId';
      const PARCOURSUP_SCOPE = 'parcoursup';
      const PARCOURSUP_SOURCE = 'parcoursup';

      const payload = {
        ine: '123456789OK',
      };
      headers = {
        authorization: generateValidRequestAuthorizationHeaderForApplication(
          PARCOURSUP_CLIENT_ID,
          PARCOURSUP_SOURCE,
          PARCOURSUP_SCOPE,
        ),
      };

      // when
      const response = await httpTestServer.request(method, url, payload, null, headers);

      // then
      expect(response.statusCode).to.equal(401);
    });
  });
});
