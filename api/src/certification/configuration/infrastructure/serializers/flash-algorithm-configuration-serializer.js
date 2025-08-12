import jsonapiSerializer from 'jsonapi-serializer';

import { FlashAssessmentAlgorithmConfiguration } from '../../../shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';

const { Serializer } = jsonapiSerializer;

/**
 * @param {Object} params
 * @param {FlashAssessmentAlgorithmConfiguration} params.flashAlgorithmConfiguration
 */
export const serialize = ({ flashAlgorithmConfiguration }) => {
  const attributes = [
    'maximumAssessmentLength',
    'challengesBetweenSameCompetence',
    'limitToOneQuestionPerTube',
    'enablePassageByAllCompetences',
    'variationPercent',
  ];
  return new Serializer('flash-algorithm-configurations', {
    transform(config) {
      return { id: 0, ...config };
    },
    attributes,
  }).serialize(flashAlgorithmConfiguration);
};

export const deserialize = ({
  maximumAssessmentLength,
  challengesBetweenSameCompetence,
  limitToOneQuestionPerTube,
  enablePassageByAllCompetences,
  variationPercent,
}) => {
  return new FlashAssessmentAlgorithmConfiguration({
    maximumAssessmentLength,
    challengesBetweenSameCompetence,
    limitToOneQuestionPerTube,
    enablePassageByAllCompetences,
    variationPercent,
  });
};
