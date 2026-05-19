import { HttpErrors } from '../../shared/application/http-errors.js';
import {
  AcquiredBadgeForbiddenUpdateError,
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
];

export { evaluationDomainErrorMappingConfiguration };
