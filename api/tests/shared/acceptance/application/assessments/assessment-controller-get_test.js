import { LOCALE } from '../../../../../src/shared/domain/constants.js';
import { Assessment } from '../../../../../src/shared/domain/models/index.js';
import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
  learningContentBuilder,
  mockLearningContent,
} from '../../../../test-helper.js';

const { FRENCH_SPOKEN } = LOCALE;

describe('Acceptance | API | assessment-controller-get', function () {
  let server;
  const courseId = 'course_id';

  describe('(no provided answer) GET /api/assessments/:id', function () {
    let options;

    [
      Assessment.types.CERTIFICATION,
      Assessment.types.PREVIEW,
      Assessment.types.CAMPAIGN,
      Assessment.types.PIX1D_MISSION,
    ].forEach(function (type) {
      context(`when the assessment is of type ${type}`, function () {
        it('should return 200 HTTP status code', async function () {
          // given
          server = await createServer();
          const userId = databaseBuilder.factory.buildUser({}).id;
          const campaignId = databaseBuilder.factory.buildCampaign().id;
          const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
            campaignId,
          }).id;
          const assessmentId = databaseBuilder.factory.buildAssessment({
            userId,
            courseId,
            state: Assessment.states.STARTED,
            type,
            campaignParticipationId,
          }).id;
          await databaseBuilder.commit();

          options = {
            method: 'GET',
            url: `/api/assessments/${assessmentId}`,
            headers: generateAuthenticatedUserRequestHeaders({ userId, acceptLanguage: FRENCH_SPOKEN }),
          };

          // when
          const response = await server.inject(options);

          // then
          expect(response.statusCode).to.equal(200);
        });
      });
    });

    context(`when the assessment is of type DEMO`, function () {
      it('should return 200 HTTP status code', async function () {
        // given
        const learningContent = [
          {
            id: '1. Information et données',
            competences: [],
            courses: [
              {
                id: 'course_id',
                isActive: true,
                competenceId: 'competence_id',
                challengeIds: ['first_challenge', 'second_challenge'],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.fromAreas(learningContent);
        await mockLearningContent(learningContentObjects);

        const assessmentId = databaseBuilder.factory.buildAssessment({
          userId: null,
          courseId,
          state: Assessment.states.STARTED,
          type: Assessment.types.DEMO,
        }).id;
        server = await createServer();

        await databaseBuilder.commit();

        options = {
          method: 'GET',
          url: `/api/assessments/${assessmentId}`,
          headers: {
            'accept-language': FRENCH_SPOKEN,
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
      });
    });

    it('should return application/json', async function () {
      // given
      server = await createServer();
      const userId = databaseBuilder.factory.buildUser({}).id;
      const assessmentId = databaseBuilder.factory.buildAssessment({
        userId,
        courseId,
        state: Assessment.states.STARTED,
        type: Assessment.types.PREVIEW,
      }).id;
      await databaseBuilder.commit();

      options = {
        method: 'GET',
        url: `/api/assessments/${assessmentId}`,
        headers: generateAuthenticatedUserRequestHeaders({ userId, acceptLanguage: FRENCH_SPOKEN }),
      };

      // when
      const response = await server.inject(options);

      // then
      const contentType = response.headers['content-type'];
      expect(contentType).to.contain('application/json');
    });

    it('should return the expected assessment', async function () {
      // given
      server = await createServer();
      const userId = databaseBuilder.factory.buildUser({}).id;
      const assessmentId = databaseBuilder.factory.buildAssessment({
        userId,
        courseId,
        state: Assessment.states.STARTED,
        type: Assessment.types.PREVIEW,
      }).id;
      await databaseBuilder.commit();

      options = {
        method: 'GET',
        url: `/api/assessments/${assessmentId}`,
        headers: generateAuthenticatedUserRequestHeaders({ userId, acceptLanguage: FRENCH_SPOKEN }),
      };

      // when
      const response = await server.inject(options);

      // then
      const expectedAssessment = {
        type: 'assessments',
        id: assessmentId.toString(),
        attributes: {
          state: Assessment.states.STARTED,
          title: 'Preview',
          type: Assessment.types.PREVIEW,
          'certification-number': null,
          'has-ongoing-challenge-live-alert': false,
          'has-ongoing-companion-live-alert': false,
          'last-question-state': Assessment.statesOfLastQuestion.ASKED,
          'competence-id': 'recCompetenceId',
          method: Assessment.methods.CHOSEN,
          'code-campaign': undefined,
          'has-checkpoints': false,
          'show-levelup': false,
          'show-progress-bar': false,
          'show-question-counter': true,
          'ordered-challenge-ids-answered': [],
        },
        relationships: {
          course: {
            data: {
              id: 'course_id',
              type: 'courses',
            },
          },
          answers: {
            data: [],
            links: {
              related: `/api/answers?assessmentId=${assessmentId}`,
            },
          },
        },
      };
      const assessment = response.result.data;
      expect(assessment).to.deep.equal(expectedAssessment);
    });
  });

  describe('(when userId and assessmentId match) GET /api/assessments/:id', function () {
    let options;

    beforeEach(async function () {
      server = await createServer();
      const userId = databaseBuilder.factory.buildUser({}).id;
      const assessmentId = databaseBuilder.factory.buildAssessment({
        userId,
        courseId,
        type: Assessment.types.PREVIEW,
      }).id;
      await databaseBuilder.commit();
      options = {
        headers: generateAuthenticatedUserRequestHeaders({ userId, acceptLanguage: FRENCH_SPOKEN }),
        method: 'GET',
        url: `/api/assessments/${assessmentId}`,
      };
    });

    it('should return 200 HTTP status code, when userId provided is linked to assessment', async function () {
      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });
  });

  describe('(answers provided, assessment completed) GET /api/assessments/:id', function () {
    let assessmentId, userId, answer1, answer2;

    beforeEach(async function () {
      server = await createServer();
      userId = databaseBuilder.factory.buildUser({}).id;
      assessmentId = databaseBuilder.factory.buildAssessment({
        userId,
        courseId,
        state: Assessment.states.COMPLETED,
        type: Assessment.types.PREVIEW,
      }).id;

      answer1 = databaseBuilder.factory.buildAnswer({
        assessmentId,
        challengeId: 'rec1',
        createdAt: new Date('2020-01-01'),
      });
      answer2 = databaseBuilder.factory.buildAnswer({
        assessmentId,
        challengeId: 'rec2',
        createdAt: new Date('2020-01-02'),
      });

      await databaseBuilder.commit();
    });

    it('should return 200 HTTP status code', async function () {
      const options = {
        method: 'GET',
        url: `/api/assessments/${assessmentId}`,
        headers: generateAuthenticatedUserRequestHeaders({ userId, acceptLanguage: FRENCH_SPOKEN }),
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(200);
    });

    it('should return application/json', async function () {
      const options = {
        method: 'GET',
        url: `/api/assessments/${assessmentId}`,
        headers: generateAuthenticatedUserRequestHeaders({ userId, acceptLanguage: FRENCH_SPOKEN }),
      };

      // when
      const response = await server.inject(options);

      // then
      const contentType = response.headers['content-type'];
      expect(contentType).to.contain('application/json');
    });

    it('should return the expected assessment', async function () {
      // given
      const options = {
        method: 'GET',
        url: `/api/assessments/${assessmentId}`,
        headers: generateAuthenticatedUserRequestHeaders({ userId, acceptLanguage: FRENCH_SPOKEN }),
      };

      // when
      const response = await server.inject(options);

      // then
      const expectedAssessment = {
        type: 'assessments',
        id: assessmentId.toString(),
        attributes: {
          state: 'completed',
          title: 'Preview',
          type: Assessment.types.PREVIEW,
          'certification-number': null,
          'has-ongoing-challenge-live-alert': false,
          'has-ongoing-companion-live-alert': false,
          'competence-id': 'recCompetenceId',
          'last-question-state': Assessment.statesOfLastQuestion.ASKED,
          method: Assessment.methods.CHOSEN,
          'code-campaign': undefined,
          'has-checkpoints': false,
          'show-levelup': false,
          'show-progress-bar': false,
          'show-question-counter': true,
          'ordered-challenge-ids-answered': ['rec1', 'rec2'],
        },
        relationships: {
          course: { data: { type: 'courses', id: courseId } },
          answers: {
            data: [
              {
                type: 'answers',
                id: answer1.id.toString(),
              },
              {
                type: 'answers',
                id: answer2.id.toString(),
              },
            ],
          },
        },
      };
      const assessment = response.result.data;
      expect(assessment.attributes).to.deep.equal(expectedAssessment.attributes);
      expect(assessment.relationships.answers.data).to.have.deep.members(expectedAssessment.relationships.answers.data);
    });
  });
});
