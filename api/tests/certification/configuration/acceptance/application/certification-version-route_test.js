import { DEFAULT_SESSION_DURATION_MINUTES } from '../../../../../src/certification/shared/domain/constants.js';
import { Frameworks } from '../../../../../src/certification/shared/domain/models/Frameworks.js';
import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  insertUserWithRoleSuperAdmin,
  knex,
} from '../../../../test-helper.js';

describe('Acceptance | Certification | Configuration | API | certification-version-route', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('PATCH /api/admin/certification-versions/{certificationVersionId}', function () {
    it('should update a certification version and return 204', async function () {
      const superAdmin = await insertUserWithRoleSuperAdmin();

      const initialChallengesConfiguration = { maximumAssessmentLength: 20, limitToOneQuestionPerTube: false };

      const existingVersion = databaseBuilder.factory.buildCertificationVersion({
        scope: Frameworks.PIX_PLUS_DROIT,
        startDate: new Date('2024-01-01'),
        expirationDate: null,
        assessmentDuration: DEFAULT_SESSION_DURATION_MINUTES,
        globalScoringConfiguration: [{ meshLevel: 0, bounds: { min: -8, max: -1.4 } }],
        competencesScoringConfiguration: [
          { competence: '1.1', values: [{ bounds: { max: -2, min: -10 }, competenceLevel: 0 }] },
        ],
        challengesConfiguration: initialChallengesConfiguration,
      });

      await databaseBuilder.commit();

      const newExpirationDate = new Date('2025-10-21T10:00:00Z');
      const newChallengesConfiguration = { maximumAssessmentLength: 32, limitToOneQuestionPerTube: true };

      const options = {
        method: 'PATCH',
        url: `/api/admin/certification-versions/${existingVersion.id}`,
        headers: generateAuthenticatedUserRequestHeaders({ userId: superAdmin.id }),
        payload: {
          data: {
            id: String(existingVersion.id),
            type: 'certification-versions',
            attributes: {
              scope: Frameworks.PIX_PLUS_DROIT,
              'start-date': '2024-01-01T00:00:00.000Z',
              'expiration-date': newExpirationDate,
              'assessment-duration': DEFAULT_SESSION_DURATION_MINUTES,
              'global-scoring-configuration': [{ meshLevel: 0, bounds: { min: -8, max: -1.4 } }],
              'competences-scoring-configuration': [
                { competence: '1.1', values: [{ bounds: { max: -2, min: -10 }, competenceLevel: 0 }] },
              ],
              'challenges-configuration': newChallengesConfiguration,
            },
          },
        },
      };

      const response = await server.inject(options);

      expect(response.statusCode).to.equal(204);

      const updatedVersion = await knex('certification_versions').where({ id: existingVersion.id }).first();
      expect(updatedVersion.expirationDate).to.deep.equal(newExpirationDate);
      expect(updatedVersion.challengesConfiguration).to.deep.equal(newChallengesConfiguration);
    });
  });
});
