import * as trainingRepository from '../../../src/devcomp/infrastructure/repositories/training-repository.js';
import * as trainingTriggerRepository from '../../../src/devcomp/infrastructure/repositories/training-trigger-repository.js';
import * as tutorialEvaluationRepository from '../../../src/devcomp/infrastructure/repositories/tutorial-evaluation-repository.js';
import * as tutorialRepository from '../../../src/devcomp/infrastructure/repositories/tutorial-repository.js';
import * as userRecommendedTrainingRepository from '../../../src/devcomp/infrastructure/repositories/user-recommended-training-repository.js';
import { getCorrection } from '../../../src/evaluation/domain/services/solution/solution-service-qrocm-dep.js';
import { fromDatasourceObject } from '../../../src/shared/infrastructure/adapters/solution-adapter.js';
import { injectDependencies } from '../../../src/shared/infrastructure/utils/dependency-injection.js';

const repositoriesWithoutInjectedDependencies = {
  trainingRepository,
  trainingTriggerRepository,
  tutorialEvaluationRepository,
  tutorialRepository,
  userRecommendedTrainingRepository,
};

/**
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 *
 * @typedef {complementaryCertificationApi} ComplementaryCertificationApi
 */
const dependencies = {
  fromDatasourceObject,
  getCorrection,
  tutorialRepository,
};

const repositories = injectDependencies(repositoriesWithoutInjectedDependencies, dependencies);

export { repositories };
