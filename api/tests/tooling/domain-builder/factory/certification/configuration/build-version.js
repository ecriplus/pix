import { Version } from '../../../../../../src/certification/configuration/domain/models/Version.js';
import { Scopes } from '../../../../../../src/certification/shared/domain/models/Scopes.js';

export const buildVersion = ({
  id = 1,
  scope = Scopes.CORE,
  startDate = new Date(),
  expirationDate,
  assessmentDuration = 105,
  globalScoringConfiguration,
  competencesScoringConfiguration,
  challengesConfiguration = {},
} = {}) => {
  return new Version({
    id,
    scope,
    startDate,
    expirationDate,
    assessmentDuration,
    globalScoringConfiguration,
    competencesScoringConfiguration,
    challengesConfiguration,
  });
};
