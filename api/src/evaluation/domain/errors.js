import { DomainError } from '../../shared/domain/errors.js';

class EmptyAnswerError extends DomainError {
  constructor(message = 'The answer value cannot be empty', code = 'ANSWER_CANNOT_BE_EMPTY') {
    super(message, code);
  }
}

class ImproveCompetenceEvaluationForbiddenError extends DomainError {
  constructor(message = 'Le niveau maximum est déjà atteint pour cette compétence.') {
    super(message);
    this.code = 'IMPROVE_COMPETENCE_EVALUATION_FORBIDDEN';
  }
}

class CompetenceResetError extends DomainError {
  constructor(remainingDaysBeforeReset) {
    super(`Il reste ${remainingDaysBeforeReset} jours avant de pouvoir réinitiliser la compétence.`);
  }
}

class AcquiredBadgeForbiddenUpdateError extends DomainError {
  constructor(message = "Il est interdit de modifier un critère d'un badge déjà acquis par un utilisateur.") {
    super(message);
  }
}

class AnswerEvaluationError extends DomainError {
  constructor(challenge) {
    super(`Problème lors de l'évaluation de la réponse du challenge: "${challenge.id}"`, '', challenge);
  }
}

class AlreadyRatedAssessmentError extends DomainError {
  constructor(message = 'Assessment is already rated.') {
    super(message);
  }
}

export {
  AcquiredBadgeForbiddenUpdateError,
  AlreadyRatedAssessmentError,
  AnswerEvaluationError,
  CompetenceResetError,
  EmptyAnswerError,
  ImproveCompetenceEvaluationForbiddenError,
};
