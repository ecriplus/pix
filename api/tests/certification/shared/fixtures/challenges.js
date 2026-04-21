import _ from 'lodash';

import * as domainBuilder from '../../../tooling/domain-builder/factory/index.js';

export const generateChallengeList = ({ length }) =>
  _.range(0, length).map((index) =>
    domainBuilder.buildChallenge({
      id: `chall${index}`,
    }),
  );

export const generateAnswersForChallenges = ({ challenges }) =>
  challenges.map(({ id: challengeId }) =>
    domainBuilder.buildAnswer({
      challengeId,
    }),
  );
