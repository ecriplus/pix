import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  insertUserWithRoleSuperAdmin,
} from '../../../../test-helper.js';

describe('Acceptance | Organizational Entities | Application | Route | Admin | OrganizationLearnerTypes', function () {
  describe('GET /api/admin/organization-learner-types', function () {
    it('returns a list of organization learner types with 200 HTTP status code', async function () {
      // given
      const server = await createServer();
      const organizationLearnerType1 = databaseBuilder.factory.buildOrganizationLearnerType({
        id: 123,
        name: 'Public 1',
      });
      const organizationLearnerType2 = databaseBuilder.factory.buildOrganizationLearnerType({
        id: 456,
        name: 'Public 2',
      });
      await databaseBuilder.commit();
      const userId = (await insertUserWithRoleSuperAdmin()).id;
      const options = {
        method: 'GET',
        url: '/api/admin/organization-learner-types',
        headers: generateAuthenticatedUserRequestHeaders({ userId }),
      };
      const expectedOrganizationLearnerTypes = [
        {
          attributes: {
            name: organizationLearnerType1.name,
          },
          id: '123',
          type: 'organization-learner-types',
        },
        {
          attributes: {
            name: organizationLearnerType2.name,
          },
          id: '456',
          type: 'organization-learner-types',
        },
      ];

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.deep.equal(expectedOrganizationLearnerTypes);
    });
  });
});
