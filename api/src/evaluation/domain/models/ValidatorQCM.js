import { Validation } from '../../../shared/domain/models/Validation.js';
import * as solutionServiceQCM from '../services/solution/solution-service-qcm.js';
import { Validator } from './Validator.js';

/**
 * Traduction: Vérificateur de réponse pour un QCM
 */
class ValidatorQCM extends Validator {
  constructor({ solution, dependencies = { solutionServiceQCM } } = {}) {
    super({ solution });
    this.dependencies = dependencies;
  }

  assess({ answer }) {
    const result = this.dependencies.solutionServiceQCM.match(answer.value, this.solution.value);

    return new Validation({
      result,
      resultDetails: null,
    });
  }
}

export { ValidatorQCM };
