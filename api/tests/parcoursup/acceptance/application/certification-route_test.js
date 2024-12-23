import {
  createServer,
  databaseBuilder,
  datamartBuilder,
  expect,
  generateValidRequestAuthorizationHeaderForApplication,
} from '../../../test-helper.js';

describe('Parcoursup | Acceptance | Application | certification-route', function () {
  let server;

  const PARCOURSUP_CLIENT_ID = 'parcoursupClientId';
  const PARCOURSUP_SCOPE = 'parcoursup';
  const PARCOURSUP_SOURCE = 'parcoursup';

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/parcoursup/students/{ine}/certification', function () {
    it('should return 200 HTTP status code and a certification for a given INE', async function () {
      // given
      const ine = '123456789OK';
      datamartBuilder.factory.buildCertificationResult({ nationalStudentId: ine });
      await datamartBuilder.commit();

      const options = {
        method: 'GET',
        url: `/api/parcoursup/students/${ine}/certification`,
        headers: {
          authorization: generateValidRequestAuthorizationHeaderForApplication(
            PARCOURSUP_CLIENT_ID,
            PARCOURSUP_SOURCE,
            PARCOURSUP_SCOPE,
          ),
        },
      };

      await databaseBuilder.commit();

      const expectedCertification = { ine };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.deep.equal(expectedCertification);
    });
  });
});
