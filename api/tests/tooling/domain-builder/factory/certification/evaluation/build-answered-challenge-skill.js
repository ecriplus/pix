import { AnsweredChallengeSkill } from '../../../../../../src/certification/evaluation/domain/models/AnsweredChallengeSkill.js';

export function buildAnsweredChallengeSkill({ id = 'recSkill1' } = {}) {
  return new AnsweredChallengeSkill({
    id,
  });
}
