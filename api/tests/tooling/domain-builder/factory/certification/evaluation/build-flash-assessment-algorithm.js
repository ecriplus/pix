import { FlashAssessmentAlgorithm } from '../../../../../../src/certification/evaluation/domain/models/FlashAssessmentAlgorithm.js';
import { FlashAssessmentAlgorithmRuleEngine } from '../../../../../../src/certification/evaluation/domain/models/FlashAssessmentAlgorithmRuleEngine.js';

export const buildFlashAssessmentAlgorithm = ({ flashAlgorithmImplementation, configuration, ruleEngine }) => {
  return new FlashAssessmentAlgorithm({
    flashAlgorithmImplementation,
    configuration,
    ruleEngine: ruleEngine ?? new FlashAssessmentAlgorithmRuleEngine([], {}),
  });
};
