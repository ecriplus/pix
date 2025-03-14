import { DomainTransaction } from '../../../src/shared/domain/DomainTransaction.js';

const TABLE_NAME = 'flash-assessment-results';

const save = async function ({ answerId, estimatedLevel, errorRate, assessmentId }) {
  const knexConn = DomainTransaction.getConnection();

  return knexConn(TABLE_NAME).insert({
    answerId,
    estimatedLevel,
    errorRate,
    assessmentId,
  });
};

export { save };
