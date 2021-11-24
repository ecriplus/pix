const _ = require('lodash');

const config = require('../../../config');

const DEFAULT_ESTIMATED_LEVEL = 0;
const START_OF_SAMPLES = -9;
const STEP_OF_SAMPLES = 18 / 80;
const END_OF_SAMPLES = 9 + STEP_OF_SAMPLES;
const samples = _.range(START_OF_SAMPLES, END_OF_SAMPLES, STEP_OF_SAMPLES);
const DEFAULT_PROBABILITY_TO_ANSWER = 1;

module.exports = { getPossibleNextChallenges, getEstimatedLevel, getNonAnsweredChallenges };

function getPossibleNextChallenges({ allAnswers, challenges } = {}) {
  const nonAnsweredChallenges = getNonAnsweredChallenges({ allAnswers, challenges });

  if (nonAnsweredChallenges?.length === 0 || allAnswers.length >= config.features.numberOfChallengesForFlashMethod) {
    return {
      hasAssessmentEnded: true,
      possibleChallenges: [],
      estimatedLevel: 0,
    };
  }

  const estimatedLevel = getEstimatedLevel({ allAnswers, challenges });

  const challengesWithReward = nonAnsweredChallenges.map((challenge) => {
    return {
      challenge,
      reward: _getReward({ estimatedLevel, discriminant: challenge.discriminant, difficulty: challenge.difficulty }),
    };
  });

  let maxReward = 0;
  const possibleChallenges = challengesWithReward.reduce((acc, challengesWithReward) => {
    if (challengesWithReward.reward > maxReward) {
      acc = [challengesWithReward.challenge];
      maxReward = challengesWithReward.reward;
    } else if (challengesWithReward.reward === maxReward) {
      acc.push(challengesWithReward.challenge);
    }
    return acc;
  }, []);

  return {
    hasAssessmentEnded: false,
    possibleChallenges,
    estimatedLevel,
  };
}

function getEstimatedLevel({ allAnswers, challenges }) {
  if (allAnswers.length === 0) {
    return DEFAULT_ESTIMATED_LEVEL;
  }

  let latestEstimatedLevel = DEFAULT_ESTIMATED_LEVEL;

  const samplesWithResults = samples.map((sample) => ({
    sample,
    gaussian: null,
    probabilityToAnswer: DEFAULT_PROBABILITY_TO_ANSWER,
    probability: null,
  }));

  for (const answer of allAnswers) {
    const answeredChallenge = _.find(challenges, ['id', answer.challengeId]);

    for (const sampleWithResults of samplesWithResults) {
      sampleWithResults.gaussian = _getGaussianValue({
        gaussianMean: latestEstimatedLevel,
        value: sampleWithResults.sample,
      });

      let probability = _getProbability({
        estimatedLevel: sampleWithResults.sample,
        discriminant: answeredChallenge.discriminant,
        difficulty: answeredChallenge.difficulty,
      });
      probability = answer.isOk() ? probability : 1 - probability;
      sampleWithResults.probabilityToAnswer *= probability;
    }

    _normalizeFieldDistribution(samplesWithResults, 'gaussian');

    for (const sampleWithResults of samplesWithResults) {
      sampleWithResults.probability = sampleWithResults.probabilityToAnswer * sampleWithResults.gaussian;
    }

    _normalizeFieldDistribution(samplesWithResults, 'probability');

    latestEstimatedLevel = samplesWithResults.reduce(
      (estimatedLevel, { sample, probability }) => estimatedLevel + sample * probability,
      0
    );
  }

  return latestEstimatedLevel;
}

function getNonAnsweredChallenges({ allAnswers, challenges }) {
  const getAnswerSkills = (answer) => challenges.find((challenge) => challenge.id === answer.challengeId).skills;
  const alreadyAnsweredSkillsIds = allAnswers
    .map(getAnswerSkills)
    .flat()
    .map((skill) => skill.id);

  const isSkillAlreadyAnswered = (skill) => alreadyAnsweredSkillsIds.includes(skill.id);
  const filterNonAnsweredChallenges = (challenge) => !challenge.skills.some(isSkillAlreadyAnswered);
  const nonAnsweredChallenges = _.filter(challenges, filterNonAnsweredChallenges);

  return nonAnsweredChallenges;
}

function _getReward({ estimatedLevel, discriminant, difficulty }) {
  const probability = _getProbability({ estimatedLevel, discriminant, difficulty });
  return probability * (1 - probability) * Math.pow(discriminant, 2);
}

function _getProbability({ estimatedLevel, discriminant, difficulty }) {
  return 1 / (1 + Math.exp(discriminant * (difficulty - estimatedLevel)));
}

function _getGaussianValue({ gaussianMean, value }) {
  const variance = 1.5;
  return Math.exp(Math.pow(value - gaussianMean, 2) / (-2 * variance)) / (Math.sqrt(variance) * Math.sqrt(2 * Math.PI));
}

function _normalizeFieldDistribution(data, field) {
  const sum = _.sumBy(data, field);
  for (const item of data) {
    item[field] /= sum;
  }
}
