import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { importNamedExportsFromDirectory } from '../../../shared/infrastructure/utils/import-named-exports-from-directory.js';
import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';

import * as activityAnswerRepository from '../../infrastructure/repositories/activity-answer-repository.js';
import * as activityRepository from '../../infrastructure/repositories/activity-repository.js';
import * as challengeRepository from '../../../shared/infrastructure/repositories/challenge-repository.js';
import * as missionRepository from '../../infrastructure/repositories/mission-repository.js';
import * as organizationLearnerRepository from '../../../../lib/infrastructure/repositories/organization-learner-repository.js';
import * as schoolRepository from '../../infrastructure/repositories/school-repository.js';

const dependencies = {
  activityAnswerRepository,
  activityRepository,
  challengeRepository,
  missionRepository,
  organizationLearnerRepository,
  schoolRepository,
};

const path = dirname(fileURLToPath(import.meta.url));

const usecasesWithoutInjectedDependencies = {
  ...(await importNamedExportsFromDirectory({ path: join(path, './'), ignoredFileNames: ['index.js'] })),
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
