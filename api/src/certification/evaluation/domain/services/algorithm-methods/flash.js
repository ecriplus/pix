import lodash from 'lodash';

import { logger } from '../../../../../shared/infrastructure/utils/logger.js';

const { orderBy, range } = lodash;

const DEFAULT_CAPACITY = 0;
const START_OF_SAMPLES = -9;
const STEP_OF_SAMPLES = 18 / 80;
const END_OF_SAMPLES = 9 + STEP_OF_SAMPLES;
const samples = range(START_OF_SAMPLES, END_OF_SAMPLES, STEP_OF_SAMPLES);
const DEFAULT_PROBABILITY_TO_ANSWER = 1;
const DEFAULT_ERROR_RATE = 5;
const ERROR_RATE_CLASS_INTERVAL = 9 / 80;

const MAX_NUMBER_OF_RETURNED_CHALLENGES = 5;

export {
  getCapacityAndErrorRate,
  getCapacityAndErrorRateHistory,
  getChallengesForNonAnsweredSkills,
  getPossibleNextChallenges,
  getReward,
};

function getPossibleNextChallenges({ availableChallenges, capacity = DEFAULT_CAPACITY } = {}) {
  const challengesWithReward = availableChallenges.map((challenge) => {
    return {
      challenge,
      reward: getReward({
        capacity,
        discriminant: challenge.discriminant,
        difficulty: challenge.difficulty,
      }),
    };
  });

  return _findBestPossibleChallenges(challengesWithReward, capacity);
}

function getCapacityAndErrorRate({ allAnswers, challenges, capacity = DEFAULT_CAPACITY, variationPercent }) {
  if (challenges.length === 0 || allAnswers.length === 0) {
    return { capacity, errorRate: DEFAULT_ERROR_RATE };
  }

  const capacityHistory = getCapacityAndErrorRateHistory({
    allAnswers,
    challenges,
    capacity,
    variationPercent,
  });

  return capacityHistory.at(-1);
}

function getCapacityAndErrorRateHistory({ allAnswers, challenges, capacity = DEFAULT_CAPACITY, variationPercent }) {
  let latestCapacity = capacity;

  let likelihood = samples.map(() => DEFAULT_PROBABILITY_TO_ANSWER);
  let normalizedPosteriori;
  let answerIndex = 0;
  let answer;

  const capacityHistory = [];

  while (answerIndex < allAnswers.length) {
    answer = allAnswers[answerIndex];

    ({ latestCapacity, likelihood, normalizedPosteriori } = _singleMeasure({
      challenges,
      answer,
      latestCapacity,
      likelihood,
      normalizedPosteriori,
      variationPercent,
    }));

    answerIndex++;

    capacityHistory.push({
      answerId: answer.id,
      capacity: latestCapacity,
      errorRate: _computeCorrectedErrorRate(latestCapacity, normalizedPosteriori),
    });
  }

  return capacityHistory;
}

function _singleMeasure({ challenges, answer, latestCapacity, likelihood, normalizedPosteriori, variationPercent }) {
  const answeredChallenge = _findChallengeForAnswer(challenges, answer);

  const normalizedPrior = _computeNormalizedPrior(latestCapacity);

  likelihood = _computeLikelihood(answeredChallenge, answer, likelihood);

  normalizedPosteriori = _computeNormalizedPosteriori(likelihood, normalizedPrior);

  latestCapacity = _computeCapacity(latestCapacity, variationPercent, normalizedPosteriori);
  return { latestCapacity, likelihood, normalizedPosteriori };
}

function _computeNormalizedPrior(gaussianMean) {
  return _normalizeDistribution(
    samples.map((sample) =>
      _getGaussianValue({
        gaussianMean: gaussianMean,
        value: sample,
      }),
    ),
  );
}

function _computeLikelihood(answeredChallenge, answer, previousLikelihood) {
  return samples.map((sample, index) => {
    let probability = _getProbability(sample, answeredChallenge.discriminant, answeredChallenge.difficulty);
    probability = answer.isOk() ? probability : 1 - probability;
    return previousLikelihood[index] * probability;
  });
}

function _computeNormalizedPosteriori(likelihood, normalizedGaussian) {
  const posteriori = samples.map((_, index) => likelihood[index] * normalizedGaussian[index]);

  return _normalizeDistribution(posteriori);
}

function _computeCapacity(previousCapacity, variationPercent, normalizedPosteriori) {
  const rawNextCapacity = lodash.sum(samples.map((sample, index) => sample * normalizedPosteriori[index]));

  return variationPercent
    ? _limitCapacityVariation(previousCapacity, rawNextCapacity, variationPercent)
    : rawNextCapacity;
}

function _computeCorrectedErrorRate(latestCapacity, normalizedPosteriori) {
  const rawErrorRate = lodash.sum(
    samples.map((sample, index) => normalizedPosteriori[index] * (sample - latestCapacity) ** 2),
  );

  return Math.sqrt(rawErrorRate - (ERROR_RATE_CLASS_INTERVAL ** 2) / 12.0); // prettier-ignore
}

function getChallengesForNonAnsweredSkills({ allAnswers, challenges }) {
  const alreadyAnsweredSkillsIds = allAnswers
    .map((answer) => _findChallengeForAnswer(challenges, answer))
    .map((challenge) => challenge.skill.id);

  const isNonAnsweredSkill = (skill) => !alreadyAnsweredSkillsIds.includes(skill.id);
  const challengesForNonAnsweredSkills = challenges.filter((challenge) => isNonAnsweredSkill(challenge.skill));

  return challengesForNonAnsweredSkills;
}

function _limitCapacityVariation(previousCapacity, nextCapacity, variationPercent) {
  const hasSmallCapacity = -variationPercent < previousCapacity && previousCapacity < variationPercent;

  const gap = hasSmallCapacity ? variationPercent : Math.abs(previousCapacity * variationPercent);

  return nextCapacity > previousCapacity
    ? Math.min(nextCapacity, previousCapacity + gap)
    : Math.max(nextCapacity, previousCapacity - gap);
}

function _findBestPossibleChallenges(challengesWithReward, capacity) {
  const canChallengeBeSuccessful = ({ challenge }) => {
    const minimumSuccessRate = 0;
    const successProbability = _getProbability(capacity, challenge.discriminant, challenge.difficulty);

    return successProbability >= minimumSuccessRate;
  };

  const orderedChallengesWithReward = orderBy(
    challengesWithReward,
    [canChallengeBeSuccessful, 'reward'],
    ['desc', 'desc'],
  );

  const possibleChallengesWithReward = orderedChallengesWithReward.slice(0, MAX_NUMBER_OF_RETURNED_CHALLENGES);

  return possibleChallengesWithReward.map(({ challenge }) => challenge);
}

function _findChallengeForAnswer(challenges, answer) {
  const challengeAssociatedToAnswer = challenges.find((challenge) => challenge.id === answer.challengeId);
  if (!challengeAssociatedToAnswer) {
    logger.warn({ answer }, 'Cannot find a challenge associated to answer.challengeId');
  }
  return challengeAssociatedToAnswer;
}

function getReward({ capacity, discriminant, difficulty }) {
  const probability = _getProbability(capacity, discriminant, difficulty);
  return probability * (1 - probability) * Math.pow(discriminant, 2);
}

// Parameters are not wrapped inside an object for performance reasons
// It avoids creating an object before each call which will trigger lots of
// garbage collection, especially when running simulators
function _getProbability(capacity, discriminant, difficulty) {
  return 1 / (1 + Math.exp(discriminant * (difficulty - capacity)));
}

function _getGaussianValue({ gaussianMean, value }) {
  const variance = 1.5;
  return Math.exp(Math.pow(value - gaussianMean, 2) / (-2 * variance)) / (Math.sqrt(variance) * Math.sqrt(2 * Math.PI));
}

function _normalizeDistribution(data) {
  const sum = lodash.sum(data);
  return data.map((value) => value / sum);
}
