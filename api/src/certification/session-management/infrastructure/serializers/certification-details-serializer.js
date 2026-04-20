import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

export function serialize(certificationDetails) {
  return new Serializer('certification-details', {
    attributes: [
      'userId',
      'createdAt',
      'lastAnswerAt',
      'status',
      'totalScore',
      'percentageCorrectAnswers',
      'competencesWithMark',
      'listChallengesAndAnswers',
    ],
  }).serialize(certificationDetails);
}
