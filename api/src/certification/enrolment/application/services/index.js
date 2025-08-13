import { injectDependencies } from '../../../../shared/infrastructure/utils/dependency-injection.js';
/**
 * @typedef {import('../../infrastructure/repositories/index.js').EnrolledCandidateRepository} EnrolledCandidateRepository
 **/
import { enrolmentRepositories } from '../../infrastructure/repositories/index.js';

/**
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 *
 * @typedef {EnrolledCandidateRepository} EnrolledCandidateRepository
 **/
const dependencies = {
  ...enrolmentRepositories,
};

import { registerCandidateParticipation } from './register-candidate-participation-service.js';

const servicesWithoutInjectedDependencies = {
  registerCandidateParticipation,
};

const services = injectDependencies(servicesWithoutInjectedDependencies, dependencies);

export { services };
