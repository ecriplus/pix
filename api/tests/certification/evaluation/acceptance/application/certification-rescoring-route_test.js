import { AlgorithmEngineVersion } from '../../../../../src/certification/shared/domain/models/AlgorithmEngineVersion.js';
import { config } from '../../../../../src/shared/config.js';
import { AnswerStatus, Assessment } from '../../../../../src/shared/domain/models/index.js';
import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  knex,
} from '../../../../test-helper.js';

describe('Certification | Evaluation | Acceptance | Application |  certification rescoring', function () {
  describe('GET /api/admin/certifications/{certificationCourseId}/rescore', function () {
    let server;
    let originalConfigValue;

    beforeEach(async function () {
      originalConfigValue = config.v3Certification.scoring.minimumAnswersRequiredToValidateACertification;
      config.v3Certification.scoring.minimumAnswersRequiredToValidateACertification = 1;

      server = await createServer();
    });

    afterEach(function () {
      config.v3Certification.scoring.minimumAnswersRequiredToValidateACertification = originalConfigValue;
    });

    it('should return 201 HTTP status code', async function () {
      // given
      const user = databaseBuilder.factory.buildUser.withRole({
        role: 'SUPER_ADMIN',
      });

      databaseBuilder.factory.learningContent.buildArea({
        id: 'recArea0',
        code: '66',
        competenceIds: ['recCompetence0'],
      });
      databaseBuilder.factory.learningContent.buildCompetence({
        id: 'recCompetence0',
        name_i18n: { fr: 'Construire un flipper', en: 'Build a pinball' },
        index: '1.1',
        areaId: 'recArea0',
        skillIds: ['recSkill0_0'],
        origin: 'Pix',
      });
      databaseBuilder.factory.learningContent.buildTube({
        id: 'recTube0_0',
      });
      databaseBuilder.factory.learningContent.buildSkill({
        id: 'recSkill0_0',
        name: '@recSkill0_0',
        tubeId: 'recTube0_0',
        status: 'actif',
        level: 1,
      });
      databaseBuilder.factory.learningContent.buildChallenge({
        id: 'recChallenge0_0_0',
        competenceId: 'recCompetence0',
        skillId: 'recSkill0_0',
      });

      databaseBuilder.factory.buildFlashAlgorithmConfiguration({
        maximumAssessmentLength: 1,
        createdAt: new Date('2010-02-01'),
      });
      databaseBuilder.factory.buildScoringConfiguration({
        createdByUserId: user.id,
        createdAt: new Date('2010-02-01'),
      });
      databaseBuilder.factory.buildCompetenceScoringConfiguration({
        createdByUserId: user.id,
        configuration: [
          {
            competence: '1.1',
            values: [
              {
                bounds: {
                  max: 0,
                  min: -5,
                },
                competenceLevel: 0,
              },
            ],
          },
        ],
      });

      const candidate = databaseBuilder.factory.buildUser();
      const sessionId = databaseBuilder.factory.buildSession({
        date: '2020/01/01',
        time: '12:00',
        finalizedAt: new Date('2020-01-01'),
        version: AlgorithmEngineVersion.V3,
      }).id;

      databaseBuilder.factory.buildCertificationCandidate({
        sessionId,
        userId: candidate.id,
      });
      const certificationCourse = databaseBuilder.factory.buildCertificationCourse({
        sessionId,
        userId: candidate.id,
        version: AlgorithmEngineVersion.V3,
      });

      const assessment = databaseBuilder.factory.buildAssessment({
        certificationCourseId: certificationCourse.id,
        userId: candidate.id,
        type: Assessment.types.CERTIFICATION,
        state: Assessment.states.COMPLETED,
      });
      const certificationChallenge = databaseBuilder.factory.buildCertificationChallenge({
        courseId: certificationCourse.id,
        isNeutralized: false,
        challengeId: 'recChallenge0_0_0',
        competenceId: 'recCompetence0',
        associatedSkillName: '@recSkill0_0',
        associatedSkillId: 'recSkill0_0',
      });
      databaseBuilder.factory.buildAnswer({
        assessmentId: assessment.id,
        challengeId: certificationChallenge.challengeId,
        result: AnswerStatus.KO.status,
      });
      databaseBuilder.factory.buildAssessmentResult({
        assessmentId: assessment.id,
        pixScore: 200,
      });

      await databaseBuilder.commit();

      const request = {
        method: 'POST',
        url: `/api/admin/certifications/${certificationCourse.id}/rescore`,
        headers: generateAuthenticatedUserRequestHeaders({ userId: user.id }),
      };

      // when
      const response = await server.inject(request);

      // then
      expect(response.statusCode).to.equal(201);
      const descOrderedAssessmentResults = await knex('assessment-results').orderBy('createdAt', 'DESC');
      expect(descOrderedAssessmentResults).to.have.length(2);
      const [lastAssessmentResult] = descOrderedAssessmentResults;
      expect(lastAssessmentResult.pixScore).to.be.equal(55);
      expect(lastAssessmentResult.juryId).to.be.equal(user.id);
    });
  });
});
