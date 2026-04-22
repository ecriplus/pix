/**
 * @typedef {import('../../../shared/domain/models/CertificationChallengeWithType.js').CertificationChallengeWithType} CertificationChallengeWithType
 * @typedef {import('../../../../evaluation/domain/models/Answer.js').Answer} Answer
 */
import JoiDate from '@joi/date';
import BaseJoi from 'joi';
const Joi = BaseJoi.extend(JoiDate);

import { AnswerStatus } from '../../../../shared/domain/models/AnswerStatus.js';
import { Assessment } from '../../../../shared/domain/models/Assessment.js';
import { validateEntity } from '../../../../shared/domain/validators/entity-validator.js';
import { AlgorithmEngineVersion } from '../../../shared/domain/models/AlgorithmEngineVersion.js';
import { ChallengeToBeDeneutralizedNotFoundError, ChallengeToBeNeutralizedNotFoundError } from '../errors.js';
import { CertificationAnswerStatusChangeAttempt } from './CertificationAnswerStatusChangeAttempt.js';
import { NeutralizationAttempt } from './NeutralizationAttempt.js';

const certificationAssessmentSchema = Joi.object({
  id: Joi.number().integer().required(),
  userId: Joi.number().integer().required(),
  certificationCourseId: Joi.number().integer().required(),
  createdAt: Joi.date().required(),
  lastAnswerAt: Joi.date().allow(null),
  endedAt: Joi.date().allow(null),
  state: Joi.string()
    .valid(
      Assessment.states.COMPLETED,
      Assessment.states.STARTED,
      Assessment.states.ENDED_BY_INVIGILATOR,
      Assessment.states.ENDED_DUE_TO_FINALIZATION,
    )
    .required(),
  version: Joi.number()
    .integer()
    .valid(...Object.values(AlgorithmEngineVersion))
    .required(),
  // TODO: Add a minimum number of 1 challenge
  certificationChallenges: Joi.array().required(),
  certificationAnswersByDate: Joi.array().required(),
});

export class CertificationAssessment {
  /**
   * @param {object} params
   * @param {Date} params.createdAt certification course creation date
   * @param {Array<CertificationChallengeWithType>} params.certificationChallenges
   * @param {Array<Answer>} params.certificationAnswersByDate
   */
  constructor({
    id,
    userId,
    certificationCourseId,
    createdAt,
    lastAnswerAt,
    state,
    version,
    certificationChallenges,
    certificationAnswersByDate,
    endedAt,
  }) {
    this.id = id;
    this.userId = userId;
    this.certificationCourseId = certificationCourseId;
    this.createdAt = createdAt;
    this.lastAnswerAt = lastAnswerAt;
    this.endedAt = endedAt;
    this.state = state;
    this.version = version;
    this.certificationChallenges = certificationChallenges;
    this.certificationAnswersByDate = certificationAnswersByDate;

    validateEntity(certificationAssessmentSchema, this);
  }

  getCertificationChallenge(challengeId) {
    return this.certificationChallenges.find((challenge) => challenge.challengeId === challengeId) || null;
  }

  getAnswerByQuestionNumber(questionNumber) {
    return this.certificationAnswersByDate[questionNumber - 1];
  }

  neutralizeChallengeByRecId(recId) {
    const challengeToBeNeutralized = this.certificationChallenges.find((challenge) => challenge.challengeId === recId);
    if (challengeToBeNeutralized) {
      challengeToBeNeutralized.neutralize();
    } else {
      throw new ChallengeToBeNeutralizedNotFoundError();
    }
  }

  endDueToFinalization() {
    if (this.state === Assessment.states.STARTED) {
      this.state = Assessment.states.ENDED_DUE_TO_FINALIZATION;
      this.endedAt = this._getLastChallengeCreatedAt();
    }
  }

  endByInvigilator({ now }) {
    this.state = Assessment.states.ENDED_BY_INVIGILATOR;
    this.endedAt = now;
  }

  neutralizeChallengeByNumberIfKoOrSkipped(questionNumber) {
    const toBeNeutralizedChallengeAnswer = this.getAnswerByQuestionNumber(questionNumber);
    if (!toBeNeutralizedChallengeAnswer) {
      return NeutralizationAttempt.failure(questionNumber);
    }

    if (_isAnswerKoOrSkipped(toBeNeutralizedChallengeAnswer.result.status)) {
      const challengeToBeNeutralized = this.certificationChallenges.find((certificationChallenge) => {
        return certificationChallenge.challengeId === toBeNeutralizedChallengeAnswer.challengeId;
      });
      challengeToBeNeutralized.neutralize();
      return NeutralizationAttempt.neutralized(questionNumber);
    }

    return NeutralizationAttempt.skipped(questionNumber);
  }

  deneutralizeChallengeByRecId(recId) {
    const challengeToBeDeneutralized = this.certificationChallenges.find(
      (certificationChallenge) => certificationChallenge.challengeId === recId,
    );
    if (challengeToBeDeneutralized) {
      challengeToBeDeneutralized.deneutralize();
    } else {
      throw new ChallengeToBeDeneutralizedNotFoundError();
    }
  }

  validateAnswerByNumberIfFocusedOut(questionNumber) {
    const challengeAnswer = this.getAnswerByQuestionNumber(questionNumber);
    if (!challengeAnswer) {
      return CertificationAnswerStatusChangeAttempt.failed(questionNumber);
    }

    if (challengeAnswer.result.isFOCUSEDOUT()) {
      challengeAnswer.result = AnswerStatus.OK;
      return CertificationAnswerStatusChangeAttempt.changed(questionNumber);
    }

    return CertificationAnswerStatusChangeAttempt.skipped(questionNumber);
  }

  findAnswersAndChallengesForCertifiableBadgeKey(certifiableBadgeKey) {
    const certificationChallengesForBadge = this.certificationChallenges.filter(
      (certificationChallenge) => certificationChallenge.certifiableBadgeKey === certifiableBadgeKey,
    );
    const challengeIds = certificationChallengesForBadge.map((ccfb) => ccfb.challengeId);
    const answersForBadge = this.certificationAnswersByDate.filter(({ challengeId }) =>
      challengeIds.includes(challengeId),
    );
    return {
      certificationChallenges: certificationChallengesForBadge,
      certificationAnswers: answersForBadge,
    };
  }

  isCompleted() {
    return this.state === Assessment.states.COMPLETED;
  }

  getChallengeRecIdByQuestionNumber(questionNumber) {
    return this.getAnswerByQuestionNumber(questionNumber)?.challengeId;
  }

  skipUnansweredChallenges() {
    this.certificationChallenges.forEach((certificationChallenge) => {
      if (
        !this.certificationAnswersByDate.some(
          (certificationAnswer) => certificationChallenge.challengeId === certificationAnswer.challengeId,
        )
      ) {
        certificationChallenge.skipAutomatically();
      }
    });
  }

  neutralizeUnansweredChallenges() {
    this.certificationChallenges.map((certificationChallenge) => {
      if (
        !this.certificationAnswersByDate.some(
          (certificationAnswer) => certificationChallenge.challengeId === certificationAnswer.challengeId,
        )
      ) {
        certificationChallenge.neutralize();
      }
    });
  }

  static get uncompletedAssessmentStates() {
    return [
      Assessment.states.STARTED,
      Assessment.states.ENDED_BY_INVIGILATOR,
      Assessment.states.ENDED_DUE_TO_FINALIZATION,
    ];
  }

  _getLastChallengeCreatedAt() {
    if (this.certificationChallenges.length === 0) {
      return this.createdAt;
    }
    return new Date(
      this.certificationChallenges
        .map((cc) => cc.createdAt.getTime())
        .sort()
        .at(-1),
    );
  }
}

function _isAnswerKoOrSkipped(answerStatus) {
  const isKo = AnswerStatus.isKO(answerStatus);
  const isSkipped = AnswerStatus.isSKIPPED(answerStatus);
  return isKo || isSkipped;
}

CertificationAssessment.states = Assessment.states;
