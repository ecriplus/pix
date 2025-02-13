import { Validation } from '../../../shared/domain/models/Validation.js';
import * as solutionServiceQROCMDep from '../services/solution/solution-service-qrocm-dep.js';
import { Validator } from './Validator.js';

/**
 * Traduction: Vérificateur de réponse pour un QROCM Dep
 */
class ValidatorQROCMDep extends Validator {
  constructor({ solution, dependencies = { solutionServiceQROCMDep } } = {}) {
    super({ solution });
    this.dependencies = dependencies;
  }

  assess({ answer }) {
    const result = this.dependencies.solutionServiceQROCMDep.match({
      answerValue: answer.value,
      solution: this.solution,
    });

    return new Validation({
      result,
      resultDetails: null,
    });
  }
}

export { ValidatorQROCMDep };
