import {
  createServer,
  databaseBuilder,
  expect,
  generateValidRequestAuthorizationHeader,
  insertUserWithRoleSuperAdmin,
} from '../../../test-helper.js';

describe('Parcoursup | Acceptance | Application | certification-route', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/parcoursup/students/{ine}/certification', function () {
    it('should return 200 HTTP status code and a certification for a given INE', async function () {
      // given
      const ine = '123456789OK';
      const superAdmin = await insertUserWithRoleSuperAdmin();
      const options = {
        method: 'GET',
        url: `/api/parcoursup/students/${ine}/certification`,
        headers: {
          authorization: generateValidRequestAuthorizationHeader(superAdmin.id),
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
