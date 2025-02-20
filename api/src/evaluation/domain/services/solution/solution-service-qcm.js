import { AnswerStatus } from '../../../../shared/domain/models/AnswerStatus.js';
import { _ } from '../../../../shared/infrastructure/utils/lodash-utils.js';

const match = function (answer, solution) {
  if (_.areCSVequivalent(answer, solution)) {
    return AnswerStatus.OK;
  }
  return AnswerStatus.KO;
};

export { match };
