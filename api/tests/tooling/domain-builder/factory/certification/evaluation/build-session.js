import { Session } from '../../../../../../src/certification/evaluation/domain/models/Session.js';

const buildSession = function ({ id = 123, isFinalized = false, isPublished = false } = {}) {
  return new Session({
    id,
    finalizedAt: isFinalized ? new Date('2020-01-01') : null,
    publishedAt: isPublished ? new Date('2020-01-01') : null,
  });
};

export { buildSession as buildResultsSession };
