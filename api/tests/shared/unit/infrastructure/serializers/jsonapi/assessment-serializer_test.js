import { DomainError } from '../../../../../../src/shared/domain/errors.js';
import { Assessment } from '../../../../../../src/shared/domain/models/index.js';
import * as serializer from '../../../../../../src/shared/infrastructure/serializers/jsonapi/assessment-serializer.js';
import { catchErrSync, domainBuilder, expect } from '../../../../../test-helper.js';

describe('Unit | Serializer | JSONAPI | assessment-serializer', function () {
  describe('#serialize', function () {
    it('should convert an Assessment model object (of type CERTIFICATION) into JSON API data', function () {
      //given
      const certificationCourseId = 1;
      const answers = [
        domainBuilder.buildAnswer({ id: 123, challengeId: 'challenge0' }),
        domainBuilder.buildAnswer({ id: 456, challengeId: 'challenge1' }),
        domainBuilder.buildAnswer({ id: 789, challengeId: 'challenge2' }),
      ];
      const assessment = domainBuilder.buildAssessment({
        type: Assessment.types.CERTIFICATION,
        certificationCourseId,
        answers,
      });
      assessment.hasCheckpoints = false;
      assessment.showProgressBar = false;
      assessment.showLevelup = false;
      assessment.showQuestionCounter = true;
      const expectedJson = {
        data: {
          id: assessment.id.toString(),
          type: 'assessments',
          attributes: {
            'certification-number': certificationCourseId,
            'has-ongoing-challenge-live-alert': false,
            'has-ongoing-companion-live-alert': false,
            state: assessment.state,
            type: assessment.type,
            title: certificationCourseId,
            'competence-id': assessment.competenceId,
            'last-question-state': Assessment.statesOfLastQuestion.ASKED,
            method: Assessment.methods.CERTIFICATION_DETERMINED,
            'show-progress-bar': false,
            'show-levelup': false,
            'has-checkpoints': false,
            'show-question-counter': true,
            'code-campaign': undefined,
            'ordered-challenge-ids-answered': ['challenge0', 'challenge1', 'challenge2'],
          },
          relationships: {
            answers: {
              data: [
                {
                  id: '123',
                  type: 'answers',
                },
                {
                  id: '456',
                  type: 'answers',
                },
                {
                  id: '789',
                  type: 'answers',
                },
              ],
              links: {
                related: '/api/answers?assessmentId=' + assessment.id.toString(),
              },
            },
            course: {
              data: {
                id: assessment.courseId.toString(),
                type: 'courses',
              },
            },
            'certification-course': {
              links: {
                related: `/api/certification-courses/${certificationCourseId}`,
              },
            },
          },
        },
        included: [
          {
            id: assessment.course.id.toString(),
            type: 'courses',
            attributes: {
              description: assessment.course.description,
              name: assessment.course.name,
              'nb-challenges': assessment.course.nbChallenges,
            },
          },
        ],
      };

      // when
      const json = serializer.serialize(assessment);

      // then
      expect(json).to.deep.equal(expectedJson);
    });

    it('should convert an Assessment model object with type COMPETENCE_EVALUATION into JSON API data', function () {
      //given
      const assessment = domainBuilder.buildAssessment({
        type: Assessment.types.COMPETENCE_EVALUATION,
        title: 'Traiter des données',
      });
      assessment.hasCheckpoints = true;
      assessment.showProgressBar = true;

      const expectedProgressionJson = {
        data: {
          id: `progression-${assessment.id}`,
          type: 'progressions',
        },
        links: {
          related: `/api/progressions/progression-${assessment.id}`,
        },
      };

      // when
      const json = serializer.serialize(assessment);

      // then
      expect(json.data.relationships['progression']).to.deep.equal(expectedProgressionJson);
      expect(json.data.attributes['certification-number']).to.be.null;
      expect(json.data.attributes['title']).to.equal('Traiter des données');
    });

    it('should convert an Assessment model object with type CAMPAIGN into JSON API data', function () {
      //given
      const assessment = domainBuilder.buildAssessment.ofTypeCampaign({
        title: 'Parcours',
        campaign: domainBuilder.buildCampaign({ title: 'Parcours', code: 'CAMPAGNE1' }),
      });
      assessment.hasCheckpoints = true;
      assessment.showProgressBar = true;
      const expectedProgressionJson = {
        data: {
          id: `progression-${assessment.id}`,
          type: 'progressions',
        },
        links: {
          related: `/api/progressions/progression-${assessment.id}`,
        },
      };

      // when
      const json = serializer.serialize(assessment);

      // then
      expect(json.data.relationships['progression']).to.deep.equal(expectedProgressionJson);
      expect(json.data.attributes['certification-number']).to.be.null;
      expect(json.data.attributes['code-campaign']).to.equal('CAMPAGNE1');
      expect(json.data.attributes['title']).to.equal('Parcours');
    });

    it('should convert an Assessment model object without course into JSON API data', function () {
      //given
      const assessment = domainBuilder.buildAssessment({
        course: null,
      });
      const expectedCourseJson = {
        data: {
          id: assessment.courseId.toString(),
          type: 'courses',
        },
      };

      // when
      const json = serializer.serialize(assessment);

      // then
      expect(json.data.relationships['course']).to.deep.equal(expectedCourseJson);
      expect(json.included).to.be.undefined;
    });
  });

  describe('#deserialize()', function () {
    let jsonAssessment;

    beforeEach(function () {
      jsonAssessment = {
        data: {
          type: 'assessments',
          id: 'assessmentId',
          attributes: {},
          relationships: {
            course: {
              data: {
                type: 'courses',
                id: 'courseId',
              },
            },
          },
        },
      };
    });

    context('when assessment is PREVIEW', function () {
      it('should deserialize an assessment of type PREVIEW', function () {
        //given
        jsonAssessment.data.attributes.type = Assessment.types.PREVIEW;

        // when
        const assessment = serializer.deserialize(jsonAssessment);

        // then
        expect(assessment).to.be.instanceOf(Assessment);
        expect(assessment.courseId).to.be.null;
        expect(assessment.id).to.equal(jsonAssessment.data.id);
        expect(assessment.type).to.equal(jsonAssessment.data.attributes.type);
        expect(assessment.method).to.equal(Assessment.methods.CHOSEN);
      });
    });

    context('when assessment is DEMO', function () {
      it('should deserialize an assessment of type DEMO', function () {
        //given
        jsonAssessment.data.attributes.type = Assessment.types.DEMO;

        // when
        const assessment = serializer.deserialize(jsonAssessment);

        // then
        expect(assessment).to.be.instanceOf(Assessment);
        expect(assessment.courseId).to.equal('courseId');
        expect(assessment.id).to.equal(jsonAssessment.data.id);
        expect(assessment.type).to.equal(jsonAssessment.data.attributes.type);
        expect(assessment.method).to.equal(Assessment.methods.COURSE_DETERMINED);
      });
    });

    [
      Assessment.types.EXAM,

      Assessment.types.PIX1D_MISSION,

      Assessment.types.PIX1D_MISSION,

      Assessment.types.CERTIFICATION,

      Assessment.types.CAMPAIGN,

      Assessment.types.COMPETENCE_EVALUATION,
    ].forEach((campaignType) => {
      it(`should throw a DomainError when deserializing an assessment of type ${campaignType}`, function () {
        // given
        jsonAssessment.data.attributes.type = campaignType;

        // when
        const error = catchErrSync(serializer.deserialize)(jsonAssessment);

        // then
        expect(error).to.be.instanceOf(DomainError);
        expect(error.message).to.equal('Only allowed to create DEMO or PREVIEW type of assessment');
      });
    });
  });
});
