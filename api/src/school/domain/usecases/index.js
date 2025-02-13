import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as areaRepository from '../../../shared/infrastructure/repositories/area-repository.js';
import * as assessmentRepository from '../../../shared/infrastructure/repositories/assessment-repository.js';
import * as sharedChallengeRepository from '../../../shared/infrastructure/repositories/challenge-repository.js';
import * as competenceRepository from '../../../shared/infrastructure/repositories/competence-repository.js';
import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import { importNamedExportsFromDirectory } from '../../../shared/infrastructure/utils/import-named-exports-from-directory.js';
import * as activityAnswerRepository from '../../infrastructure/repositories/activity-answer-repository.js';
import * as activityRepository from '../../infrastructure/repositories/activity-repository.js';
import * as challengeRepository from '../../infrastructure/repositories/challenge-repository.js';
import * as missionAssessmentRepository from '../../infrastructure/repositories/mission-assessment-repository.js';
import * as missionLearnerRepository from '../../infrastructure/repositories/mission-learner-repository.js';
import * as missionRepository from '../../infrastructure/repositories/mission-repository.js';
import * as organizationLearnerRepository from '../../infrastructure/repositories/organization-learner-repository.js';
import * as schoolRepository from '../../infrastructure/repositories/school-repository.js';

const dependencies = {
  activityAnswerRepository,
  activityRepository,
  areaRepository,
  assessmentRepository,
  challengeRepository,
  competenceRepository,
  missionAssessmentRepository,
  missionRepository,
  missionLearnerRepository,
  organizationLearnerRepository,
  schoolRepository,
  sharedChallengeRepository,
};

const path = dirname(fileURLToPath(import.meta.url));

const usecasesWithoutInjectedDependencies = {
  ...(await importNamedExportsFromDirectory({ path: join(path, './'), ignoredFileNames: ['index.js'] })),
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
