import { CombinedCourseBlueprint } from '../../../../src/quest/domain/models/CombinedCourseBlueprint.js';
import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  insertUserWithRoleSuperAdmin,
} from '../../../test-helper.js';

describe('Quest | Acceptance | Application | Combined course blueprint Route ', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/admin/combined-course-blueprints', function () {
    context('when user is admin ', function () {
      it('should return the list of combined course blueprints', async function () {
        // given
        const adminUser = await insertUserWithRoleSuperAdmin();

        databaseBuilder.factory.buildCombinedCourseBlueprint({
          content: CombinedCourseBlueprint.buildContentItems([{ moduleShortId: 'mon-module' }]),
        });
        databaseBuilder.factory.buildCombinedCourseBlueprint({
          content: CombinedCourseBlueprint.buildContentItems([{ moduleShortId: 'mon-module-abc' }]),
        });
        await databaseBuilder.commit();

        const options = {
          method: 'GET',
          url: `/api/admin/combined-course-blueprints`,
          headers: generateAuthenticatedUserRequestHeaders({ userId: adminUser.id }),
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data).to.have.lengthOf(2);
      });
    });
  });

  describe('POST /api/admin/combined-course-blueprints', function () {
    context('when user is admin ', function () {
      it('should create a combined course blueprint', async function () {
        // given
        const adminUser = await insertUserWithRoleSuperAdmin();
        const payload = {
          data: {
            type: 'combined-course-blueprints',
            attributes: {
              name: 'Mon parcours combiné',
              'internal-name': 'Mon schéma de parcours combiné',
              description: 'La description combinix',
              illustration: 'illustration.svg',
              content: CombinedCourseBlueprint.buildContentItems([{ moduleShortId: 'modulox' }]),
            },
          },
        };
        const options = {
          method: 'POST',
          url: `/api/admin/combined-course-blueprints`,
          headers: generateAuthenticatedUserRequestHeaders({ userId: adminUser.id }),
          payload,
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(201);
        expect(response.result.data.attributes.name).to.equal(payload.data.attributes.name);
      });
    });
  });

  describe('GET /api/admin/combined-course-blueprints/:blueprintId', function () {
    context('when user is admin ', function () {
      it('should return combined course blueprint for given id', async function () {
        // given
        const adminUser = await insertUserWithRoleSuperAdmin();

        const combinedCourseBlueprint = databaseBuilder.factory.buildCombinedCourseBlueprint({
          content: CombinedCourseBlueprint.buildContentItems([{ moduleShortId: 'mon-module' }]),
        });
        await databaseBuilder.commit();

        const options = {
          method: 'GET',
          url: `/api/admin/combined-course-blueprints/${combinedCourseBlueprint.id}`,
          headers: generateAuthenticatedUserRequestHeaders({ userId: adminUser.id }),
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        expect(response.result.data.id).to.equal(combinedCourseBlueprint.id.toString());
        expect(response.result.data.type).to.equal('combined-course-blueprints');
      });
    });
  });

  describe('DELETE /api/admin/combined-course-blueprints/:blueprintId/organizations/:organizationId', function () {
    context('when user is admin ', function () {
      it('should detach a combined course blueprint from organization', async function () {
        // given
        const adminUser = await insertUserWithRoleSuperAdmin();

        const { combinedCourseBlueprintId, organizationId } =
          databaseBuilder.factory.buildCombinedCourseBlueprintShare();
        await databaseBuilder.commit();

        const options = {
          method: 'DELETE',
          url: `/api/admin/combined-course-blueprints/${combinedCourseBlueprintId}/organizations/${organizationId}`,
          headers: generateAuthenticatedUserRequestHeaders({ userId: adminUser.id }),
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(204);
      });
    });
  });
});
