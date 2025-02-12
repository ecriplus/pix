import _ from 'lodash';

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

  describe('PATCH /api/certification-centers/{certificationCenterId}/certification-center-memberships/{id}', function () {
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
      it('returns a 200 HTTP status code with the updated certification center membership', async function () {
        // given
        const certifCenterAdminUser = databaseBuilder.factory.buildUser.withCertificationCenterMembership({
          certificationCenterId: certificationCenter.id,
          role: 'ADMIN',
        });
        const request = {
          method: 'PATCH',
          url: `/api/certification-centers/${certificationCenter.id}/certification-center-memberships/${certificationCenterMembership.id}`,
          payload: {
            id: user.id,
            data: {
              'certification-center-membership-id': certificationCenterMembership.id.toString(),
              type: 'certification-center-memberships',
              attributes: {
                role: 'ADMIN',
              },
            },
          },
          headers: generateAuthenticatedUserRequestHeaders({ userId: certifCenterAdminUser.id }),
        };
        await databaseBuilder.commit();

        // when
        const response = await server.inject(request);

        // then
        expect(response.statusCode).to.equal(200);
        const expectedUpdatedCertificationCenterMembership = {
          data: {
            type: 'members',
            id: user.id.toString(),
            attributes: {
              'certification-center-membership-id': certificationCenterMembership.id,
              'first-name': certifCenterAdminUser.firstName,
              'is-referer': false,
              'last-name': certifCenterAdminUser.lastName,
              role: 'ADMIN',
            },
          },
        };
        expect(_.omit(response.result, 'included')).to.deep.equal(expectedUpdatedCertificationCenterMembership);
      });
    });

    context('Error cases', function () {
      context('when current user has a member role', function () {
        it('returns a 403 HTTP status code', async function () {
          // given
          const certifCenterMemberUser = databaseBuilder.factory.buildUser.withCertificationCenterMembership({
            certificationCenterId: certificationCenter.id,
            role: 'MEMBER',
          });
          const request = {
            method: 'PATCH',
            url: `/api/certification-centers/${certificationCenter.id}/certification-center-memberships/${certificationCenterMembership.id}`,
            payload: {
              id: user.id,
              data: {
                type: 'certification-center-memberships',
                'certification-center-membership-id': certificationCenterMembership.id.toString(),
                attributes: {
                  role: 'ADMIN',
                },
              },
            },
            headers: generateAuthenticatedUserRequestHeaders({ userId: certifCenterMemberUser.id }),
          };
          await databaseBuilder.commit();

          // when
          const { statusCode } = await server.inject(request);

          // then
          expect(statusCode).to.equal(403);
        });
      });

      context('when certification center membership does not belong to the certification center', function () {
        it('returns a 403 HTTP status code', async function () {
          // given
          const certifCenterAdminUser = databaseBuilder.factory.buildUser.withCertificationCenterMembership({
            certificationCenterId: certificationCenter.id,
            role: 'ADMIN',
          });

          const anotherCertificationCenter = databaseBuilder.factory.buildCertificationCenter();
          const anotherCertificationCenterMembership = databaseBuilder.factory.buildCertificationCenterMembership({
            certificationCenterId: anotherCertificationCenter.id,
          });
          const anotherCertificationCenterMembershipId = anotherCertificationCenterMembership.id;

          const request = {
            method: 'PATCH',
            url: `/api/certification-centers/${certificationCenter.id}/certification-center-memberships/${anotherCertificationCenterMembershipId}`,
            payload: {
              data: {
                id: user.id,
                type: 'certification-center-memberships',
                attributes: {
                  role: 'ADMIN',
                  'certification-center-membership-id': anotherCertificationCenterMembershipId,
                },
              },
            },
            headers: generateAuthenticatedUserRequestHeaders({ userId: certifCenterAdminUser.id }),
          };
          await databaseBuilder.commit();

          // when
          const { statusCode } = await server.inject(request);

          // then
          expect(statusCode).to.equal(403);
        });
      });

      context('when certification center membership ID in url is not valid', function () {
        it('returns a 400 HTTP status code', async function () {
          // given
          const certifCenterAdminUser = databaseBuilder.factory.buildUser.withCertificationCenterMembership({
            certificationCenterId: certificationCenter.id,
            role: 'ADMIN',
          });
          const wrongCertificationCenterMembershipId = certificationCenterMembership.id + 1;
          const notValidMembershipId = `toto`;
          const request = {
            method: 'PATCH',
            url: `/api/certification-centers/${certificationCenter.id}/certification-center-memberships/${notValidMembershipId}`,
            payload: {
              data: {
                id: user.id,
                type: 'certification-center-memberships',
                attributes: {
                  role: 'ADMIN',
                  'certification-center-membership-id': wrongCertificationCenterMembershipId,
                },
              },
            },
            headers: generateAuthenticatedUserRequestHeaders({ userId: certifCenterAdminUser.id }),
          };
          await databaseBuilder.commit();

          // when
          const { statusCode } = await server.inject(request);

          // then
          expect(statusCode).to.equal(400);
        });
      });
    });
  });
});
