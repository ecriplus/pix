import { config } from '../../../../shared/config.js';
import { random } from '../../../../shared/infrastructure/utils/random.js';

function getChallengePicker(probabilityToPickChallenge = config.v3Certification.defaultProbabilityToPickChallenge) {
  return ({ possibleChallenges }) => {
    const challengeIndex = random.binaryTreeRandom(probabilityToPickChallenge, possibleChallenges.length);

    return possibleChallenges[challengeIndex];
  };
}

const pickChallengeService = {
  getChallengePicker,
};

export default pickChallengeService;
