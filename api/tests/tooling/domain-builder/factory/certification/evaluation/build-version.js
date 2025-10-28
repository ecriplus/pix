import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';
import { Version } from '../../../../../../src/certification/shared/domain/models/Version.js';

export const buildVersion = ({ id = 1, scope = Frameworks.CORE, challengesConfiguration = {} } = {}) => {
  return new Version({
    id,
    scope,
    challengesConfiguration,
  });
};
