// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeF... Remove this comment to see the full error message
const ChallengeForPixAutoAnswer = require('../../domain/read-models/ChallengeForPixAutoAnswer');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'challengeD... Remove this comment to see the full error message
const challengeDatasource = require('../datasources/learning-content/challenge-datasource');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get(challengeId: $TSFixMe) {
    const challenge = await challengeDatasource.get(challengeId);
    return new ChallengeForPixAutoAnswer({
      id: challenge.id,
      solution: challenge.solution,
      type: challenge.type,
      autoReply: challenge.autoReply,
    });
  },
};
