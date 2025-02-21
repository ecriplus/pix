import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  insertUserWithRoleSuperAdmin,
} from '../../../test-helper.js';

describe('Acceptance | API | Certification Center Membership', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
    await insertUserWithRoleSuperAdmin();
  });

  context('Pix Certif routes', function () {
    describe('DELETE /api/certification-center-memberships/{id}', function () {
      let certificationCenter;
      let certificationCenterMembership;
      let user;

      beforeEach(async function () {
        certificationCenter = databaseBuilder.factory.buildCertificationCenter();
        user = databaseBuilder.factory.buildUser();
        certificationCenterMembership = databaseBuilder.factory.buildCertificationCenterMembership({
          certificationCenterId: certificationCenter.id,
          userId: user.id,
        });
        await databaseBuilder.commit();
      });

      context('Success cases', function () {
        context('when parameters are valid', function () {
          it('returns a 204 HTTP status code', async function () {
            const pixCertifAdminUser = databaseBuilder.factory.buildUser.withCertificationCenterMembership({
              role: 'ADMIN',
              certificationCenterId: certificationCenter.id,
            });

            const request = {
              method: 'DELETE',
              url: `/api/certification-center-memberships/${certificationCenterMembership.id}`,
              headers: generateAuthenticatedUserRequestHeaders({ userId: pixCertifAdminUser.id }),
            };

            await databaseBuilder.commit();

            // when
            const { statusCode } = await server.inject(request);

            // then
            expect(statusCode).to.equal(204);
          });
        });
      });

      context('Error cases', function () {
        context('when user does not have a valid role', function () {
          it('returns a 403 HTTP status code', async function () {
            const userWithoutRole = databaseBuilder.factory.buildUser();

            const request = {
              method: 'DELETE',
              url: `/api/certification-center-memberships/${certificationCenterMembership.id}`,
              headers: generateAuthenticatedUserRequestHeaders({ userId: userWithoutRole.id }),
            };

            await databaseBuilder.commit();

            // when
            const { statusCode } = await server.inject(request);

            // then
            expect(statusCode).to.equal(403);
          });
        });
      });
    });
  });
});
