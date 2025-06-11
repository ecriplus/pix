import jsonapiSerializer from 'jsonapi-serializer';

import { Progression } from '../../../../evaluation/domain/models/Progression.js';
import { DomainError } from '../../../domain/errors.js';
import { Assessment } from '../../../domain/models/Assessment.js';

const { Serializer } = jsonapiSerializer;

const serialize = function (assessments) {
  return new Serializer('assessment', {
    transform(currentAssessment) {
      const assessment = Object.assign({}, currentAssessment);

      // TODO: We can't use currentAssessment.isCertification() because
      // this serializer is also used by model CampaignAssessment
      assessment.certificationNumber = null;
      assessment.hasOngoingChallengeLiveAlert = currentAssessment.hasOngoingChallengeLiveAlert;
      assessment.hasOngoingCompanionLiveAlert = currentAssessment.hasOngoingCompanionLiveAlert;
      if (currentAssessment.type === Assessment.types.CERTIFICATION) {
        assessment.certificationNumber = currentAssessment.certificationCourseId;
        assessment.certificationCourse = { id: currentAssessment.certificationCourseId };
      }

      // Same here for isForCampaign() and isCompetenceEvaluation()
      if (currentAssessment.hasCheckpoints) {
        assessment.progression = {
          id: Progression.generateIdFromAssessmentId(currentAssessment.id),
        };
      }

      assessment.codeCampaign = currentAssessment.campaignCode;

      if (!currentAssessment.course) {
        assessment.course = { id: currentAssessment.courseId };
      }

      // ordered in the repository call
      assessment.orderedChallengeIdsAnswered = assessment.answers?.map((answer) => answer.challengeId) ?? [];
      return assessment;
    },
    attributes: [
      'title',
      'type',
      'state',
      'answers',
      'codeCampaign',
      'certificationNumber',
      'hasOngoingChallengeLiveAlert',
      'hasOngoingCompanionLiveAlert',
      'course',
      'certificationCourse',
      'progression',
      'competenceId',
      'lastQuestionState',
      'method',
      'showProgressBar',
      'hasCheckpoints',
      'showLevelup',
      'showQuestionCounter',
      'orderedChallengeIdsAnswered',
    ],
    answers: {
      ref: 'id',
      relationshipLinks: {
        related(record) {
          return `/api/answers?assessmentId=${record.id}`;
        },
      },
    },
    course: {
      ref: 'id',
      included: _includeCourse(assessments),
      attributes: ['name', 'description', 'nbChallenges'],
    },
    certificationCourse: {
      ref: 'id',
      ignoreRelationshipData: true,
      relationshipLinks: {
        related(record, current) {
          return `/api/certification-courses/${current.id}`;
        },
      },
    },
    progression: {
      ref: 'id',
      relationshipLinks: {
        related(record, current) {
          return `/api/progressions/${current.id}`;
        },
      },
    },
  }).serialize(assessments);
};

const deserialize = function (json) {
  const type = json.data.attributes.type;
  if (![Assessment.types.DEMO, Assessment.types.PREVIEW].includes(type)) {
    throw new DomainError('Only allowed to create DEMO or PREVIEW type of assessment');
  }
  const method = Assessment.computeMethodFromType(type);

  let courseId = null;
  if (type !== Assessment.types.PREVIEW) {
    courseId = json.data.relationships.course.data.id;
  }

  return new Assessment({
    id: json.data.id,
    type,
    courseId,
    method,
  });
};

export { deserialize, serialize };

function _includeCourse(assessments) {
  if (Array.isArray(assessments)) {
    return assessments.length && assessments[0].course;
  }

  return assessments.course ? true : false;
}
