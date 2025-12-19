import { random } from '../../../../shared/infrastructure/utils/random.js';

function getChallengePicker(probabilityToPickChallenge) {
  return ({ possibleChallenges }) => {
    const challengeIndex = random.binaryTreeRandom(probabilityToPickChallenge, possibleChallenges.length);

    return possibleChallenges[challengeIndex];
  };
}

const pickChallengeService = {
  getChallengePicker,
};

export default pickChallengeService;
