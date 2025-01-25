import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
} from '../../../../test-helper.js';

describe('Acceptance | Team | Application | Routes | certification-center-membership ', function () {
  let server, options;

  describe('GET /api/certification-centers/{certificationCenterId}/members', function () {
    it('returns 200 http status code', async function () {
      // given
      server = await createServer();
      const certificationCenter = databaseBuilder.factory.buildCertificationCenter();
      const certificationCenterMember = databaseBuilder.factory.buildUser();
      const user2 = databaseBuilder.factory.buildUser();
      databaseBuilder.factory.buildCertificationCenterMembership({
        certificationCenterId: certificationCenter.id,
        userId: certificationCenterMember.id,
      });
      databaseBuilder.factory.buildCertificationCenterMembership({
        certificationCenterId: certificationCenter.id,
        userId: user2.id,
      });
      await databaseBuilder.commit();

      options = {
        headers: generateAuthenticatedUserRequestHeaders({ userId: certificationCenterMember.id }),
        method: 'GET',
        url: `/api/certification-centers/${certificationCenter.id}/members`,
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data[0].id).to.equal(certificationCenterMember.id.toString());
      expect(response.result.data[1].id).to.equal(user2.id.toString());
    });
  });
});
