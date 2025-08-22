import Joi from 'joi';

import { EntityValidationError } from '../../../../shared/domain/errors.js';
import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { ModuleInstantiationError } from '../../errors.js';
import { QcuCorrectionResponse } from '../QcuCorrectionResponse.js';
import { ValidatorQCU } from '../validator/ValidatorQCU.js';
import { QCU } from './QCU.js';

class QCUForAnswerVerification extends QCU {
  userResponse;
  constructor({ id, instruction, locales, proposals, solution, validator }) {
    super({ id, instruction, locales, proposals, solution: { value: solution } });

    assertNotNullOrUndefined(solution, 'The solution is required for a verification QCU');
    this.#assertSolutionIsAnExistingProposal(solution, proposals);

    if (validator) {
      this.validator = validator;
    } else {
      this.validator = new ValidatorQCU({ solution: this.solution });
    }
  }

  #assertSolutionIsAnExistingProposal(solution, proposals) {
    const isSolutionAnExistingProposal = proposals.find(({ id: proposalId }) => proposalId === solution);
    if (!isSolutionAnExistingProposal) {
      throw new ModuleInstantiationError('The QCU solution id is not an existing proposal id');
    }
  }

  setUserResponse(userResponse) {
    this.#validateUserResponseFormat(userResponse);
    this.userResponse = userResponse[0];
  }

  assess() {
    const validation = this.validator.assess({ answer: { value: this.userResponse } });

    return new QcuCorrectionResponse({
      status: validation.result,
      feedback: this.#getFeedback(),
      solution: this.solution.value,
    });
  }

  #validateUserResponseFormat(userResponse) {
    const qcuResponseSchema = Joi.string()
      .pattern(/^[0-9]+$/)
      .required();

    const validUserResponseSchema = Joi.array().items(qcuResponseSchema).min(1).max(1).required();

    const { error } = validUserResponseSchema.validate(userResponse);
    if (error) {
      throw EntityValidationError.fromJoiErrors(error.details);
    }
  }

  #getSpecificFeedbackByProposalId(proposalId) {
    const proposalFound = this.proposals.find((proposal) => proposal.id === proposalId);
    if (proposalFound) {
      return proposalFound.feedback;
    }
  }

  #getFeedback() {
    return this.#getSpecificFeedbackByProposalId(this.userResponse);
  }
}

export { QCUForAnswerVerification };
