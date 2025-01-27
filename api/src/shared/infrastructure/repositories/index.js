import * as certificationEvaluationApi from '../../../certification/evaluation/application/api/select-next-certification-challenge-api.js';
import { injectDependencies } from '../utils/dependency-injection.js';
import * as certificationEvaluationRepository from './certification-challenge-repository.js';

/**
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 *
 * @typedef {certificationEvaluationRepository} CertificationEvaluationRepository
 */
const repositoriesWithoutInjectedDependencies = {
  certificationEvaluationRepository,
};

/**
 * Using {@link https://jsdoc.app/tags-type "Closure Compiler's syntax"} to document injected dependencies
 *
 * @typedef {certificationEvaluationApi} CertificationEvaluationApi
 */
const dependencies = {
  certificationEvaluationApi,
};

const repositories = injectDependencies(repositoriesWithoutInjectedDependencies, dependencies);

export { repositories };
