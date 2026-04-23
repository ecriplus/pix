import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

const serialize = function (certificateSummaries, { translate }) {
  return new Serializer('certificate-summaries', {
    transform(certificateSummary) {
      return {
        ...certificateSummary,
        comment: certificateSummary.juryComment.getComment(translate),
        reachedMeshLevel: certificateSummary.reachedMeshLevel?.split('_').at(-1) ?? null,
      };
    },
    attributes: [
      'verificationCode',
      'certificationStartedAt',
      'certificationFramework',
      'certificationCenterName',
      'pixScore',
      'comment',
      'status',
      'extraCertificationStatus',
      'certificateType',
      'reachedMeshLevel',
    ],
  }).serialize(certificateSummaries);
};

export { serialize };
