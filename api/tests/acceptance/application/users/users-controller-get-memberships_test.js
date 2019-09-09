const { expect, databaseBuilder, generateValidRequestAuthorizationHeader } = require('../../../test-helper');
const createServer = require('../../../../server');

const Membership = require('../../../../lib/domain/models/Membership');

describe('Acceptance | Controller | users-controller-get-memberships', () => {

  let userId;
  let organization;
  let membershipId;
  let options;
  const organizationRole = Membership.roles.MEMBER;
  let server;

  beforeEach(async () => {
    server = await createServer();
  });
  
  describe('GET /users/:id/memberships', () => {

    beforeEach(async () => {
      userId = databaseBuilder.factory.buildUser().id;
      organization = databaseBuilder.factory.buildOrganization();
      membershipId = databaseBuilder.factory.buildMembership({ organizationId: organization.id, userId, organizationRole }).id;
      await databaseBuilder.commit();

      options = {
        method: 'GET',
        url: `/api/users/${userId}/memberships`,
        headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
      };
    });

    afterEach(async () => {
      await databaseBuilder.clean();
    });

    describe('Resource access management', () => {

      it('should respond with a 401 - unauthorized access - if user is not authenticated', async () => {
        // given
        options.headers.authorization = 'invalid.access.token';

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(401);
      });

      it('should respond with a 403 - forbidden access - if requested user is not the same as authenticated user', async () => {
        // given
        const otherUserId = 9999;
        options.headers.authorization = generateValidRequestAuthorizationHeader(otherUserId);

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    describe('Success case', () => {

      it('should return found memberships with 200 HTTP status code', async () => {
        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result).to.deep.equal({
          data: [
            {
              type: 'memberships',
              id: membershipId.toString(),
              attributes: {
                'organization-role': organizationRole,
              },
              relationships: {
                'organization': { data: { type: 'organizations', id: organization.id.toString() }, },
                'user': { data: null, },
              },
            },
          ],
          included: [
            {
              type: 'organizations',
              id: organization.id.toString(),
              attributes: {
                name: organization.name,
                type: organization.type,
                code: organization.code,
                'is-managing-students': organization.isManagingStudents,
              },
              relationships: {
                campaigns: {
                  links: {
                    related: `/api/organizations/${organization.id.toString()}/campaigns`
                  }
                },
                memberships: {
                  links: {
                    related: `/api/organizations/${organization.id.toString()}/memberships`
                  }
                },
                'target-profiles': {
                  links: {
                    related: `/api/organizations/${organization.id.toString()}/target-profiles`
                  }
                },
                students: {
                  links: {
                    related: `/api/organizations/${organization.id.toString()}/students`
                  }
                },
              }
            },
          ],
        });
      });
    });
  });
});
