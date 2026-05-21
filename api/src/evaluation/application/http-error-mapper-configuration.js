import { HttpErrors } from '../../shared/application/errors/http-errors.js';
import {
  AcquiredBadgeForbiddenUpdateError,
  AlreadyRatedAssessmentError,
  AnswerEvaluationError,
  CompetenceResetError,
  EmptyAnswerError,
  ImproveCompetenceEvaluationForbiddenError,
} from '../domain/errors.js';

const evaluationDomainErrorMappingConfiguration = [
  {
    name: EmptyAnswerError.name,
    httpErrorFn: (error) => {
      return new HttpErrors.BadRequestError(error.message, error.code);
    },
  },
  {
    name: ImproveCompetenceEvaluationForbiddenError.name,
    httpErrorFn: (error) => {
      return new HttpErrors.ForbiddenError(error.message, error.code);
    },
  },
  {
    name: CompetenceResetError.name,
    httpErrorFn: (error) => {
      return new HttpErrors.PreconditionFailedError(error.message);
    },
  },
  {
    name: AcquiredBadgeForbiddenUpdateError.name,
    httpErrorFn: (error) => {
      return new HttpErrors.ForbiddenError(error.message);
    },
  },
  {
    name: AnswerEvaluationError.name,
    httpErrorFn: (error) => {
      return new HttpErrors.InternalServerError(error.message);
    },
  },
  {
    name: AlreadyRatedAssessmentError.name,
    httpErrorFn: (error) => {
      return new HttpErrors.PreconditionFailedError(error.message);
    },
  },
];

export { evaluationDomainErrorMappingConfiguration };
