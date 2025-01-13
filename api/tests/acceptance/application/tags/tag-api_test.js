import _ from 'lodash';

import {
  createServer,
  databaseBuilder,
  expect,
  generateValidRequestAuthorizationHeader,
  insertUserWithRoleCertif,
  insertUserWithRoleSuperAdmin,
} from '../../../test-helper.js';

describe('Acceptance | Route | tag-router', function () {
  describe('GET /api/admin/{id}/recently-used', function () {
    context('when an admin member with a role "SUPER_ADMIN" tries to access this resource', function () {
      it('returns a list of recently used tags with a 200 HTTP status code', async function () {
        // given
        const server = await createServer();

        const basedTag = databaseBuilder.factory.buildTag({ name: 'konoha' });
        const mostUsedTag = databaseBuilder.factory.buildTag({ name: 'kumo' });
        const leastUsedTag = databaseBuilder.factory.buildTag({ name: 'hueco mundo' });
        const tags = [mostUsedTag, databaseBuilder.factory.buildTag({ name: 'kiri' }), leastUsedTag];
        const organizations = [];

        _.times(3, () => organizations.push(databaseBuilder.factory.buildOrganization()));

        for (const [index, organization] of organizations.entries()) {
          const tagIds = tags.slice(0, index + 1).map(({ id }) => id);
          tagIds.push(basedTag.id);
          _buildOrganizationTags(organization.id, tagIds);
        }

        await databaseBuilder.commit();

        const userId = (await insertUserWithRoleSuperAdmin()).id;

        // when
        const { statusCode, result } = await server.inject({
          method: 'GET',
          url: `/api/admin/tags/${basedTag.id}/recently-used`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        });

        // then
        expect(statusCode).to.equal(200);
        expect(result.data).to.have.lengthOf(3);
      });
    });

    context('when an admin member with a role "CERTIF" tries to access this resource', function () {
      it('returns an error with a 403 HTTP status code', async function () {
        // given
        const server = await createServer();

        const basedTag = databaseBuilder.factory.buildTag({ name: 'konoha' });
        const mostUsedTag = databaseBuilder.factory.buildTag({ name: 'kumo' });
        const leastUsedTag = databaseBuilder.factory.buildTag({ name: 'hueco mundo' });
        const tags = [mostUsedTag, databaseBuilder.factory.buildTag({ name: 'kiri' }), leastUsedTag];
        const organizations = [];

        _.times(3, () => organizations.push(databaseBuilder.factory.buildOrganization()));

        for (const [index, organization] of organizations.entries()) {
          const tagIds = tags.slice(0, index + 1).map(({ id }) => id);
          tagIds.push(basedTag.id);
          _buildOrganizationTags(organization.id, tagIds);
        }

        await databaseBuilder.commit();

        const userId = (await insertUserWithRoleCertif()).id;

        // when
        const { statusCode } = await server.inject({
          method: 'GET',
          url: `/api/admin/tags/${basedTag.id}/recently-used`,
          headers: { authorization: generateValidRequestAuthorizationHeader(userId) },
        });

        // then
        expect(statusCode).to.equal(403);
      });
    });
  });
});

function _buildOrganizationTags(organizationId, tagIds) {
  tagIds.forEach((tagId) => {
    databaseBuilder.factory.buildOrganizationTag({ organizationId, tagId });
  });
}
