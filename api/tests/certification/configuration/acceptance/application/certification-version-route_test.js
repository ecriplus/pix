import { createServer } from '../../../../../server.js';
import { SCOPES } from '../../../../../src/certification/shared/domain/models/Scopes.js';
import { expect } from '../../../../test-helper.js';
import { databaseBuilder } from '../../../../tooling/databases.js';
import { generateAuthenticatedUserRequestHeaders } from '../../../../tooling/test-utils/http-server.js';

describe('Acceptance | Certification | Configuration | API | certification-version-route', function () {
  let server;
  let superAdmin;

  beforeEach(async function () {
    server = await createServer();
    superAdmin = databaseBuilder.factory.buildUser.withRoleSuperAdmin();
    await databaseBuilder.commit();
  });

  describe('GET /api/admin/certification-versions/{certificationVersionId}', function () {
    it('should return the version details with areas for a given id', async function () {
      // given
      const version = databaseBuilder.factory.buildCertificationVersion({
        scope: SCOPES.CORE,
        startDate: new Date('2025-01-11'),
        expirationDate: new Date('2026-01-01'),
        assessmentDuration: 100,
        minimumAnswersRequiredToValidateACertification: 20,
        comments: 'Some awesome comments',
        challengesConfiguration: {
          maximumAssessmentLength: 32,
          challengesBetweenSameCompetence: 2,
          limitToOneQuestionPerTube: true,
          enablePassageByAllCompetences: true,
          variationPercent: 0.5,
          defaultCandidateCapacity: -3,
          defaultProbabilityToPickChallenge: 51,
        },
      });

      databaseBuilder.factory.buildCertificationFrameworksChallenge({ versionId: version.id });

      await databaseBuilder.commit();

      const options = {
        method: 'GET',
        url: `/api/admin/certification-versions/${version.id}`,
        headers: generateAuthenticatedUserRequestHeaders({ userId: superAdmin.id }),
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
      expect(response.result.data).to.deep.equal({
        id: String(version.id),
        type: 'certification-versions',
        attributes: {
          'start-date': new Date('2025-01-11'),
          'expiration-date': new Date('2026-01-01'),
          'assessment-duration': 100,
          'minimum-answers-required-for-validation': 20,
          'maximum-assessment-length': 32,
          comments: 'Some awesome comments',
        },
        relationships: {
          areas: { data: [] },
        },
      });
      expect(response.result.included).to.be.undefined;
    });
  });

  describe('PATCH /api/admin/certification-versions/{certificationVersionId}', function () {
    it('updates the details of a version for a given id', async function () {
      // given
      const version = databaseBuilder.factory.buildCertificationVersion({
        scope: SCOPES.CORE,
        startDate: new Date('2025-01-11'),
        expirationDate: new Date('2026-01-01'),
        assessmentDuration: 100,
        minimumAnswersRequiredToValidateACertification: 20,
        challengesConfiguration: {
          maximumAssessmentLength: 32,
          challengesBetweenSameCompetence: 2,
          limitToOneQuestionPerTube: true,
          enablePassageByAllCompetences: true,
          variationPercent: 0.5,
          defaultCandidateCapacity: -3,
          defaultProbabilityToPickChallenge: 51,
        },
        comments: 'Old comments',
      });

      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        versionId: version.id,
      });

      await databaseBuilder.commit();

      const options = {
        method: 'PATCH',
        url: `/api/admin/certification-versions/${version.id}`,
        headers: generateAuthenticatedUserRequestHeaders({
          userId: superAdmin.id,
        }),
        payload: {
          data: {
            id: version.id,
            attributes: {
              'assessment-duration': 120,
              'minimum-answers-required-for-validation': 20,
              'maximum-assessment-length': 30,
              comments: 'Newly updated comments',
            },
            type: 'certification-versions',
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
      const [updatedVersion] = await knex('certification_versions').where({ id: version.id });
      expect(updatedVersion.comments).to.equal('Newly updated comments');
    });
  });

  describe('DELETE /api/admin/certification-frameworks/{id}', function () {
    it('should return 204 HTTP status code', async function () {
      // given
      const versionId = databaseBuilder.factory.buildCertificationVersion({
        scope: SCOPES.CORE,
        startDate: null,
        expirationDate: null,
      }).id;

      await databaseBuilder.commit();

      const options = {
        method: 'DELETE',
        url: `/api/admin/certification-frameworks/${versionId}`,
        headers: generateAuthenticatedUserRequestHeaders({ userId: superAdmin.id }),
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(204);
    });
  });
});
