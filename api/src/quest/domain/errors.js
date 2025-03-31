import { DomainError } from '../../shared/domain/errors.js';

export class InvalidComparisonError extends DomainError {
  constructor({ comparisonOperator, typeofCriterion, typeofData }) {
    super(
      `Comparison "${comparisonOperator}" invalid when comparing a criterion of type "${typeofCriterion}" and a data of type "${typeofData}".`,
      'INVALID_COMPARISON',
    );
  }
}
