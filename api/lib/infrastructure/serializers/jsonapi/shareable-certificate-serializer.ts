// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Serializer... Remove this comment to see the full error message
const { Serializer } = require('jsonapi-serializer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'typeForAtt... Remove this comment to see the full error message
const typeForAttribute = (attribute: $TSFixMe) => {
  if (attribute === 'resultCompetenceTree') {
    return 'result-competence-trees';
  }
  if (attribute === 'resultCompetences') {
    return 'result-competences';
  }
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'resultComp... Remove this comment to see the full error message
const resultCompetenceTree = {
  included: true,
  ref: 'id',
  attributes: ['id', 'areas'],

  areas: {
    included: true,
    ref: 'id',
    attributes: ['code', 'name', 'title', 'color', 'resultCompetences'],

    resultCompetences: {
      included: true,
      ref: 'id',
      type: 'result-competences',
      attributes: ['index', 'level', 'name', 'score'],
    },
  },
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'attributes... Remove this comment to see the full error message
const attributes = [
  'certificationCenter',
  'birthdate',
  'birthplace',
  'date',
  'firstName',
  'deliveredAt',
  'isPublished',
  'isCancelled',
  'lastName',
  'pixScore',
  'resultCompetenceTree',
  'cleaCertificationStatus',
  'certifiedBadgeImages',
  'maxReachableLevelOnCertificationDate',
];

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  serialize(certificate: $TSFixMe) {
    return new Serializer('certifications', {
      typeForAttribute,
      transform(shareableCertificate: $TSFixMe) {
        shareableCertificate.cleaCertificationStatus = shareableCertificate.cleaCertificationResult.status;
        return shareableCertificate;
      },
      attributes,
      resultCompetenceTree,
    }).serialize(certificate);
  },
};
