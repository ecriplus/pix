import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
import * as scoringConfigurationRepository from '../../../shared/infrastructure/repositories/scoring-configuration-repository.js';

/**
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 * @typedef {scoringConfigurationRepository} ScoringConfigurationRepository
 **/
const dependencies = { scoringConfigurationRepository };

import { saveCertificationScoringConfiguration } from './save-certification-scoring-configuration.js';
import { saveCompetenceForScoringConfiguration } from './save-competence-for-scoring-configuration.js';
import { simulateCapacityFromScore } from './simulate-capacity-from-score.js';
import { simulateScoreFromCapacity } from './simulate-score-from-capacity.js';

const usecasesWithoutInjectedDependencies = {
  saveCertificationScoringConfiguration,
  saveCompetenceForScoringConfiguration,
  simulateCapacityFromScore,
  simulateScoreFromCapacity,
};

const usecases = injectDependencies(usecasesWithoutInjectedDependencies, dependencies);

export { usecases };
