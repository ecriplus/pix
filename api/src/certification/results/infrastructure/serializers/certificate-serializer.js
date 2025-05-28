import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const typeForAttribute = (attribute) => {
  if (attribute === 'resultCompetenceTree') {
    return 'result-competence-trees';
  }
  if (attribute === 'resultCompetences') {
    return 'result-competences';
  }
};

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

const attributes = [
  'firstName',
  'lastName',
  'birthdate',
  'birthplace',
  'date',
  'deliveredAt',
  'certificationCenter',
  'isPublished',
  'pixScore',
  'resultCompetenceTree',
  'certifiedBadgeImages',
  'maxReachableLevelOnCertificationDate',
  'version',
  'algorithmEngineVersion',
  'globalLevelLabel',
  'globalSummaryLabel',
  'globalDescriptionLabel',
  'level',
  'certificationDate',
  'verificationCode',
  'acquiredComplementaryCertification',
];

const serialize = function ({ certificate, translate }) {
  let globalLevel = {};

  if (certificate?.globalLevel) {
    globalLevel = {
      globalLevelLabel: certificate.globalLevel.getLevelLabel(translate),
      globalSummaryLabel: certificate.globalLevel.getSummaryLabel(translate),
      globalDescriptionLabel: certificate.globalLevel.getDescriptionLabel(translate),
      level: _getLevel(certificate),
    };
  }
  return new Serializer('certifications', {
    transform(certificate) {
      return {
        ...certificate,
        ...globalLevel,
        acquiredComplementaryCertification: certificate.acquiredComplementaryCertification?.imageUrl,
      };
    },
    typeForAttribute,
    attributes,
    resultCompetenceTree,
  }).serialize(certificate);
};

function _getLevel(certificate) {
  return certificate.globalLevel.meshLevel.split('_').at(-1);
}

export { serialize };
