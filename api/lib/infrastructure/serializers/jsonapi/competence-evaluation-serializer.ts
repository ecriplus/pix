// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(competenceEvaluations: $TSFixMe) {
    return new Serializer('competence-evaluations', {
      transform(current: $TSFixMe) {
        const competenceEvaluation = Object.assign({}, current);
        competenceEvaluation.assessment = { id: current.assessmentId };
        return competenceEvaluation;
      },
      attributes: ['createdAt', 'updatedAt', 'userId', 'competenceId', 'assessment', 'scorecard', 'status'],
      assessment: {
        ref: 'id',
        included: false,
      },
      scorecard: {
        ref: 'id',
        ignoreRelationshipData: true,
        relationshipLinks: {
          related: function (record: $TSFixMe) {
            return `/api/scorecards/${record.userId}_${record.competenceId}`;
          },
        },
      },
    }).serialize(competenceEvaluations);
  },
};
