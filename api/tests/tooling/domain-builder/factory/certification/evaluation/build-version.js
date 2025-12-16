import { Scopes } from '../../../../../../src/certification/shared/domain/models/Scopes.js';
import { Version } from '../../../../../../src/certification/shared/domain/models/Version.js';

export const buildVersion = ({ id = 1, scope = Scopes.CORE, challengesConfiguration = {} } = {}) => {
  return new Version({
    id,
    scope,
    challengesConfiguration,
  });
};
