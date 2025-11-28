import { AnsweredChallenge } from '../../../../../../src/certification/evaluation/domain/models/AnsweredChallenge.js';
import { buildAnsweredChallengeSkill } from './build-answered-challenge-skill.js';

export function buildAnsweredChallenge({ id = 'recCHAL1', skill = buildAnsweredChallengeSkill() } = {}) {
  return new AnsweredChallenge({
    id,
    skill,
  });
}
