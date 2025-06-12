import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import * as userRepository from '../../../identity-access-management/infrastructure/repositories/user.repository.js';
import * as llmApi from '../../../llm/application/api/llm-api.js';
import * as campaignRepository from '../../../prescription/campaign/infrastructure/repositories/campaign-repository.js';
import * as campaignParticipationRepository from '../../../prescription/campaign-participation/infrastructure/repositories/campaign-participation-repository.js';
import * as targetProfileRepository from '../../../prescription/target-profile/infrastructure/repositories/target-profile-repository.js';
import * as targetProfileSummaryForAdminRepository from '../../../prescription/target-profile/infrastructure/repositories/target-profile-summary-for-admin-repository.js';
import * as knowledgeElementRepository from '../../../shared/infrastructure/repositories/knowledge-element-repository.js';
import * as skillRepository from '../../../shared/infrastructure/repositories/skill-repository.js';
import * as tubeRepository from '../../../shared/infrastructure/repositories/tube-repository.js';
import { injectDependencies } from '../../../shared/infrastructure/utils/dependency-injection.js';
import { importNamedExportsFromDirectory } from '../../../shared/infrastructure/utils/import-named-exports-from-directory.js';
import { repositories } from '../../infrastructure/repositories/index.js';
import * as targetProfileTrainingRepository from '../../infrastructure/repositories/target-profile-training-repository.js';

const path = dirname(fileURLToPath(import.meta.url));

const dependencies = {
  ...repositories,
  campaignRepository,
  campaignParticipationRepository,
  knowledgeElementRepository,
  targetProfileRepository,
  targetProfileSummaryForAdminRepository,
  tubeRepository,
  targetProfileTrainingRepository,
  skillRepository,
  userRepository,
  llmApi,
};

const usecasesWithoutInjectedDependencies = {
  ...(await importNamedExportsFromDirectory({ path: join(path, './'), ignoredFileNames: ['index.js'] })),
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
